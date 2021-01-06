const database = require("../../../config/database");

exports.deleteItem = async (req, res) => {
  let { item } = req.params;
  database.query(`DELETE * FROM items WHERE id = ${item}`, (error, result) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "operation unsuccessful",
        error: {
          statusCode: 500,
          description: "could not delete item",
          error,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "operation successful",
      data: {
        statusCode: 200,
        description: "successfully deleted item",
        item: result,
      },
    });
  });
};