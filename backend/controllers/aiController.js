// backend/controllers/aiController.js
const { getModel } = require('../config/gemini');
const Course = require('../models/Course');
const Review = require('../models/Review');

// @desc Générer un rapport d’analyse des reviews d’un cours
// @route POST /api/ai/analyze-reviews/:courseId
// @access Private
exports.analyzeReviews = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Récupérer le cours
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Cours non trouvé' });
    }

    // Récupérer les reviews du cours
    const reviews = await Review.find({ course: courseId }).populate('user', 'username');
    if (reviews.length === 0) {
      return res.status(400).json({ message: 'Aucune review disponible pour ce cours' });
    }

    // Préparer les données pour Gemini
    const reviewsText = reviews
      .map((review, index) => `Review ${index + 1} (${review.rating}/5): "${review.comment}"`)
      .join('\n\n');

    const prompt = `
Tu es un expert en analyse de feedback éducatif.
Analyse ces ${reviews.length} reviews du cours "${course.title}":
${reviewsText}

Génère un rapport structuré au format suivant :

## Sentiment Général
[Positif / Neutre / Négatif avec justification]

## Note Moyenne Calculée
[La note moyenne est ${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)}/5]

## Points Forts (Top 3)
1. [Point fort 1]
2. [Point fort 2]
3. [Point fort 3]

## Points d’Amélioration (Top 3)
1. [Amélioration 1]
2. [Amélioration 2]
3. [Amélioration 3]

## Recommandations pour l’Instructeur
[2-3 recommandations concrètes]

## Résumé en une phrase
[Une phrase résumant l’opinion générale]
`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    res.json({
      success: true,
      data: {
        courseTitle: course.title,
        reviewCount: reviews.length,
        analysis
      }
    });
  } catch (error) {
    console.error('Erreur analyse IA :', error);
    res.status(500).json({ message: 'Erreur lors de l\'analyse', error: error.message });
  }
};

// @desc Générer une description attractive pour un cours
// @route POST /api/ai/generate-description
// @access Private
exports.generateCourseDescription = async (req, res) => {
  try {
    const { title, instructor, keywords } = req.body;

    if (!title || !instructor) {
      return res.status(400).json({ message: 'Titre et instructeur requis' });
    }

    const keywordsText = keywords ? keywords.join(', ') : '';
    const prompt = `
Génère une description attractive et professionnelle pour un cours en ligne.

Titre: ${title}
Instructeur: ${instructor}
Mots-clés: ${keywordsText}

La description doit :
- être engageante et motivante (2-3 paragraphes)
- mentionner les bénéfices pour l'étudiant
- inclure ce qu'ils vont apprendre
- terminer par un appel à l'action

Retourne uniquement la description sans titre.
`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const description = result.response.text();

    res.json({ success: true, data: { description } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Générer des suggestions de cours similaires
// @route POST /api/ai/similar-courses/:courseId
// @access Public
exports.suggestSimilarCourses = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Cours non trouvé' });

    const allCourses = await Course.find({ _id: { $ne: courseId } })
      .select('title description instructor');

    if (allCourses.length === 0) {
      return res.json({ success: true, data: { suggestions: [] } });
    }

    const coursesText = allCourses
      .map((c, i) => `${i + 1}. "${c.title}" par ${c.instructor} - Description : ${c.description.substring(0, 100)}...`)
      .join('\n\n');

    const prompt = `
Cours de référence :
Titre : ${course.title}
Description : ${course.description}

Liste des autres cours disponibles :
${coursesText}

Analyse le contenu et recommande les 3 cours les plus similaires.
Pour chaque cours, explique brièvement pourquoi il est similaire (2-3 phrases).

Format de réponse :
1. [Numéro du cours] - [Raison de similarité]
2. [Numéro du cours] - [Raison de similarité]
3. [Numéro du cours] - [Raison de similarité]
`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const suggestions = result.response.text();

    res.json({
      success: true,
      data: {
        referenceCourse: course.title,
        suggestions,
        availableCourses: allCourses.map(c => ({ id: c._id, title: c.title }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Générer une bio professionnelle pour un utilisateur
// @route POST /api/ai/generate-bio
// @access Private
// @desc Générer une bio professionnelle pour un utilisateur
// @route POST /api/ai/generate-bio
// @access Private
exports.generateBio = async (req, res) => {
  try {
    const { interests, experience, goals } = req.body;

    if (!interests || !experience) {
      return res.status(400).json({ message: 'Intérêts et expérience requis' });
    }

    const prompt = `
Génère une bio professionnelle concise et engageante (3-4 phrases maximum).

Intérêts: ${interests}
Expérience: ${experience}
Objectifs: ${goals || 'Non spécifié'}

La bio doit être écrite à la première personne et donner envie de connecter avec cette personne.
`;

    const model = getModel(); // Gemini ou autre modèle IA
    const result = await model.generateContent(prompt);
    const bio = result.response.text();

    res.json({ success: true, data: { bio } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Obtenir des insights généraux sur tous les cours
// @route GET /api/ai/platform-insights
// @access Private (Admin)
exports.getPlatformInsights = async (req, res) => {
  try {
    const courses = await Course.find().select('title instructor');
    const allReviews = await Review.find().populate('course', 'title');

    const stats = {
      totalCourses: courses.length,
      totalReviews: allReviews.length,
      averageRating: allReviews.length > 0
        ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2)
        : 0
    };

    const reviewsByCourse = {};
    allReviews.forEach(review => {
      const courseTitle = review.course.title;
      if (!reviewsByCourse[courseTitle]) reviewsByCourse[courseTitle] = [];
      reviewsByCourse[courseTitle].push(review.comment);
    });

    const courseSummaries = Object.entries(reviewsByCourse)
      .map(([title, comments]) => `${title}: ${comments.length} reviews`)
      .join('\n');

    const prompt = `
Tu es un analyste de plateforme éducative.

Voici les statistiques générales :
- ${stats.totalCourses} cours au total
- ${stats.totalReviews} reviews au total
- Note moyenne : ${stats.averageRating}/5

Distribution des reviews par cours :
${courseSummaries}

Génère un rapport d’insights avec :

## Santé Générale de la Plateforme
[évaluation globale]

## Tendances Observées
[2-3 tendances principales]

## Cours Populaires
[Identifier les cours les plus actifs]

## Recommandations Stratégiques
[3 recommandations pour améliorer la plateforme]
`;

    const model = getModel();
    const result = await model.generateContent(prompt);
    const insights = result.response.text();

    res.json({ success: true, data: { stats, insights } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
