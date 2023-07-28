from flask_smorest import Api
from flask import Flask, jsonify
from flask_cors import CORS

import properties
from db import db
from blueprints.user import blp as RegisterBlueprint

app = Flask(__name__)
cors = CORS(app)

app.config["PROPOGATE_EXCEPTIONS"] = True
app.config["API_TITLE"] = "Bank of the Kingdom API"
app.config["API_VERSION"] = "v1"
app.config["OPENAPI_VERSION"] = "3.0.3"
app.config["OPENAPI_URL_PREFIX"] = "/"
app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

app.config["SQLALCHEMY_DATABASE_URI"] = properties.db_conn
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
with app.app_context():
    db.create_all()

api = Api(app)

api.register_blueprint(RegisterBlueprint)


@app.get('/')
def test_get():
    print('test')
    return "test"


@app.post('/')
def test_post():
    print('test post')
    return jsonify("test post")


if __name__ == '__main__':
    app.run(debug=True)
