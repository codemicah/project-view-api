const database = require("../config/database");

exports.add = async(req, res)=>{
    const { item, price, quantity, project } = req.body
    const user = req.user.email;

    if(!item || !price || !quantity || !project){
        return res.status(400).json({
            success: false,
            message: "operation unsuccessful",
            error: {
                statusCode: 400,
                description: "item, price quantity and project are required"
            }
        });
    }

    database.query(
        `CREATE TABLE IF NOT EXISTS items(
            id INT PRIMARY KEY AUTO_INCREMENT NOT NULL, 
            item TEXT, 
            price TEXT, 
            quantity INT,
            status INT,
            project INT(5),
            FOREIGN KEY (project) REFERENCES projects(code)
        )`, 
        (error)=>{
            console.log(error)
            if(error){
                return res.status(500).json({
                    success: false,
                    message: "operation unsuccessful",
                    error: {
                        statusCode: 500,
                        description: "could not add item"
                    }
                });
            }
            console.log("created pending table");

            database.query(
                `INSERT INTO items(item, price, quantity, status, project) VALUES(?, ?, ?, ?, ?)`,
                [item, price, quantity, 1, project],
                (error, result, fields) => {
                    if (error) {
                        return res.status(500).json({
                            success: false,
                            message: "operation unsuccessful",
                            error: {
                                statusCode: 500,
                                description: "could not add item"
                            }
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "operation successful",
                        data: {
                            statusCode: 201,
                            description: "item added",
                            item: {
                                id: result.insertId,
                                project,
                                item,
                                price,
                                quantity,
                                status: 1
                            }
                        }
                    });
                });
        });
};

exports.getAll = async(req, res)=>{
    let { code, project } = req.body;

    if(!code){
        return res.status(400).json({
            success: false,
            message: "operation unsuccessful",
            error: {
                statusCode: 400,
                description: "code is required"
            }
        });
    }

    database.query(`SELECT * FROM items WHERE code = ${code}`, (error, result)=>{
        if (error) {
          return res.status(500).json({
            success: false,
            message: "operation unsuccessful",
            error: {
              statusCode: 500,
              description: "could not add item",
            },
          });
        }

        return res.status(200).json({
            success: true,
            message: "operation successful",
            data: {
                statusCode: 200,
                description: `all items in project ${code}`,
                items: results
            }
        });
    });
};

exports.getPending = async(req, res)=>{
    let { project } = req.params;

    database.query(`SELECT * FROM items WHERE project = ${project} AND status = ${1}`, (error, result)=>{
        if (error) {
            return res.status(500).json({
                success: false,
                message: "operation unsuccessful",
                error: {
                    statusCode: 500,
                    description: "could not get items",
                },
            });
        }
        return res.status(200).json({
            success: true,
            message: "operation successful",
            data: {
                statusCode: 200,
                description: `all pending items in ${project}`,
                items: result
            }
        });
    });
};

exports.getCompleted = async (req, res) => {
    let { project } = req.params;

    database.query(`SELECT * FROM items WHERE project = ${project} AND status = ${0}`, (error, result) => {
        if (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "operation unsuccessful",
                error: {
                    statusCode: 500,
                    description: "could not get items",
                },
            });
        }
        return res.status(200).json({
            success: true,
            message: "operation successful",
            data: {
                statusCode: 200,
                description: `all completed items in ${project}`,
                items: result
            }
        });
    });
};

exports.markComplete = async(req, res)=>{
    let { item } = req.params;

    database.query(`UPDATE items SET status = ${0} WHERE id = ${item}`, (error, result)=>{
        if(error){
            return res.status(500).json({
                success: false,
                message: "operation unsuccessful",
                error: {
                    statusCode: 500,
                    description: "could not mark complete"
                }
            });
        }
        database.query(`SELECT * FROM items WHERE id = ${item}`, (error, result)=>{
            return res.status(200).json({
                success: true,
                message: "operation successful",
                data: {
                    statusCode: 200,
                    description: "item marked as complete",
                    item: result[0]
                }
            });
        });
    });
};

exports.update = async(req, res)=>{
    console.log(req);
};

exports.delete = async(req, res)=>{
    let { item } = req.params;
    database.query(`DELETE * FROM items WHERE id = ${item}`, (error, result)=>{
        if (error) {
          return res.status(500).json({
            success: false,
            message: "operation unsuccessful",
            error: {
              statusCode: 500,
              description: "could not delete item",
            },
          });
        }

        return res.status(200).json({
            success: true,
            message: "operation successful",
            data: {
                statusCode: 200,
                description: "successfully deleted item",
                item: result
            }
        });
    });
};
