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
        objective: ['objective', 'objectives', 'summary'],
        experience: ['experience', 'experiences', 'work experience'],
        education: ['education'],
        skills: ['skills', 'technology', 'technologies'],
        links: ['links', 'profiles'],
        projects: ['projects'],
        achievements: ['achievements'],
        extracurricular: ['extracurricular', 'extra curricular', 'extra-curricular'],
        certification: ['certification', 'certifications'],
        interests: ['interests and activities', 'interests']
    },
    profiles: {
        github: [/(?:(http(s)?:\/\/)?(www\.)?)(github\.com\/[A-z 0-9 _ -]+\/?)/],
        linkedin: [/(?:(http(s)?:\/\/)?([\w]+\.)?)(linkedin\.com\/in\/[A-z 0-9 _ -]+\/?)/],
        twitter: [/(?:(http(s)?:\/\/)?(.*\.)?)(twitter\.com\/[A-z 0-9 _]+\/?)/],
        facebook: [/(?:(http(s)?:\/\/)?(www\.)?)((facebook|fb)\.com\/[A-z 0-9 _ - \.]+\/?)/]
    }
};
