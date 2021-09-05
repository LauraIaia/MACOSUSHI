var mysql = require('mysql2');

class Db{
    constructor(){
        this.connection = mysql.createConnection({
            host     : 'localhost',            
            user: 'root',
            //password: 'laura00@',
            password: 'sup3rP@$$w0rd',
            database : 'macosushi',
            connectTimeout: 60000 //timeout db per debug
        });
    }   


    addUserProfile(userProfile, callback) {
        /*
        this.connection.connect(function(err){
            if(err)
                callback(err);
        });
        */
        this.connection.query("insert into utenti(id, nome, email) values(?, ?, ?)", 
        [
            userProfile.id,
            userProfile.nickname,
            userProfile.emails[0].value
        ], callback);
    }

    userProfileExists(userId, callback) {
        /*
        this.connection.connect(function(err){
            if(err)
                callback(err);
        });
        */
        this.connection.query("select 1 from utenti where id = ?", [userId], callback);
    }

    getAllDishes(callback){
        this.connection.query(
            `select p.id, p.nome, descrizione, foto, s.nome sottogruppo from piatti p
            join sottogruppi s on idSOTTOGRUPPI = s.id
            order by s.nome;`, callback);
    }

    getOrders(idUtente, callback){
        this.connection.query(
            `select 
                p.id,
                max(p.nome) nome, 
                max(p.descrizione) descrizione, 
                max(p.foto) foto, 
                min(o.dt) dt, 
                avg(o.voto) voto,
                max(p.idSottogruppi) st
            from ordini o 
            join piatti p on idPiatto = p.id 
            where idUtente = ?
            group by o.sessione, p.id  
            order by min(o.dt) desc`, [idUtente], callback);
    }

    getDish(id, callback){
        this.connection.query("select * from piatti where id = ?", [id], callback);
    }

    getDishes(ids, callback){
        /*
        this.connection.query(
            `select o.id, p.* 
            from ordini o
            join piatti p on o.idPiatto = p.id 
            where o.id = ?`, [ids], callback);
        */
        
        const selectDish = (dish) => {
            return new Promise((resolve, reject)=>{
                this.connection.query(
                    `select o.id ordine, o.voto, p.* 
                    from ordini o
                    join piatti p on o.idPiatto = p.id 
                    where o.id = ?`,
                    [dish], (error, results, fields) =>{
                    if(error){
                        return reject(error);
                    }
                    resolve(results);                    
                });        
            })
        }
        Promise.all(ids.map(id => selectDish(id)))
        .then(results => callback(null, results))
        .catch(error => callback(error, null));
    }

    addOrder(orders, callback){
        const insertOrder = (order) => {
            return new Promise((resolve, reject) => {
                this.connection.query(
                    "insert into ordini(`tavolo`, `idPiatto`, `qty`, `idUtente`, `sessione`) values (?)",
                    [order], (error, results, fields) =>{
                    if(error){
                        return reject(error);
                    }
                    resolve(results);             
                });
            });
        }
        Promise.all(orders.map(o => insertOrder(o)))
            .then(results => callback(null, results))
            .catch(error => callback(error, null));
        /*
        var i = 0; 
        while(i < order.length){
        this.connection.query("insert into ordini(`tavolo`, `idPiatto`, `qty`, `idUtente`, `sessione`) values (?)",
            [order[i]], (error, results, fields) =>{
                if(error){
                    callback(error, results, fields);
                    return;
                }

                if(i == order.length - 1){
                    callback(error, results, fields);
                    return;
                }
                i++;
            });
        }
        */
    }

    addReview(review, callback){
        /*
        this.connection.query(
            `update ordini 
            set voto = ? 
            where 
                sessione = ? and 
                idUtente = ? and 
                idPiatto = ? 
            order by dt desc
            limit 1`,
            [review.voto, review.sessione, review.utente, review.piatto], callback);
        */

        this.connection.query(
            `update ordini 
            set voto = ? 
            where id = ?`,
            [review.voto, review.idOrdine], callback);
    
    }

    getSottogruppi(callback){
        this.connection.query("select * from sottogruppi", callback);
    }
}

module.exports = Db;