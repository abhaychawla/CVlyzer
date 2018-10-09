/**
 * Dictionary Expressions
 */
module.exports = {
    regularExpressions: {
        name: [/([A-Za-z]{1,15}) ([A-Za-z]{1,15})/],
        email: [/[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*/],
        phone: [/(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d/]
    },
    titles: {
        objective: ['objective', 'objectives'],
        summary: ['summary'],
        experience: ['experience', 'experiences'],
        education: ['education'],
        skills: ['skills', 'technology', 'technologies'],
        projects: ['projects'],
        links: ['links'],
        achievements: ['achievements'],
        extracurricular: ['extra curricular'],
        certification: ['certifications'],
        interests: ['interests']
    }
};
