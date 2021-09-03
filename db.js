var mysql = require('mysql2');

class Db{
    constructor(){
        this.connection = mysql.createConnection({
            host     : 'localhost',            
            user: 'root',
            password: 'laura00@',
            //password: 'sup3rP@$$w0rd',
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
        this.connection.query("insert into users(id, username, email) values(?, ?, ?)", 
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
        this.connection.query("select 1 from users where id = ?", [userId], callback);
    }

    getDishes(callback){
        this.connection.query(
            `select p.id, p.nome, descrizione, foto, s.nome sottogruppo from piatti p
            join sottogruppi s on idSOTTOGRUPPI = s.id
            order by s.nome;`, callback);
    }

    getOrders(idUtente, callback){
        this.connection.query(
            `select max(p.nome), max(p.descrizione), max(p.foto), min(o.dt), avg(o.voto) from ordini o 
            join piatti p on idPiatto = p.id 
            where idUtente = ?
            group by o.sessione, p.id  
            order by min(o.dt) desc`, [idUtente], callback);
    }

    getDish(id, callback){
        this.connection.query("select * from piatti where id = ?", [id], callback);
    }

    addOrder(order, callback){
    
        for(var i = 0; i < order.length; i++){
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
            });
        }
    }
}

module.exports = Db;