const _newton = {
    // G: 6.674 * Math.pow(10, -2),
    G: 8.674 * Math.pow(10, -2),
    appliquerGravite:(corps1, corps2)=> {
        let r = _newton.calculerDistance(corps1, corps2);
        let forceMagnitude = _newton.loiUNewton(corps1.conf.mass, corps2.conf.mass, r);    
        // Calculer la direction de la force
        let dx = corps2.conf.position.x - corps1.conf.position.x;
        let dy = corps2.conf.position.y - corps1.conf.position.y;
        let forceDirection = { x: dx / r, y: dy / r };
        
        // Appliquer la force aux corps
        // La force est proportionnelle et opposée; Newtons Troisième Loi

        corps1.conf.velocity.x += forceDirection.x * forceMagnitude / corps1.conf.mass;
        corps1.conf.velocity.y += forceDirection.y * forceMagnitude / corps1.conf.mass;
        // corps2.conf.velocity.x += -forceDirection.x * forceMagnitude / corps2.conf.mass;
        // corps2.conf.velocity.y += -forceDirection.y * forceMagnitude / corps2.conf.mass;
        // console.log(forceMagnitude)
    },
    loiUNewton:(masse1, masse2, r)=> {
        // Retourne F qui est la force gravitationnelle entre les deux masses.
        // G est la constante gravitationnelle, qui a une valeur d'environ 6.674×10−11 N (m/kg)26.674×10−11N(m/kg)²
        // masse1 et masse2 sont les masses des deux objets
        // r est la distance entre les centres de masse des deux objets
    
        if(r===0) {
            throw new Error("La distance r entre les centres de masse des deux objets ne peut être = à 0");
        }
        
        let F = _newton.G * ( ( masse1*masse2 ) / ( r*r ) );
        return F;
    },
    calculerDistance:(corps1, corps2)=> {
        let dx = corps1.conf.position.x - corps2.conf.position.x;
        let dy = corps1.conf.position.y - corps2.conf.position.y;
        return Math.sqrt(dx * dx + dy * dy);
    },
}