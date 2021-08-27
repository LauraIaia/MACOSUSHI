SELECT * FROM macosushi.piatti p
JOIN macosushi.piatti_has_categorie pc on p.idpiatti = pc.piatti_idpiatti
join macosushi.categorie c on c.idcategorie = pc.categorie_idcategorie