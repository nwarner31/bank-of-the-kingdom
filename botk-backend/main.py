from flask_smorest import Api
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager

import properties
from db import db
from blueprints.user import blp as register_blueprint
from models.blocklist import BLOCKLIST

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
app.config["JWT_SECRET_KEY"] = properties.jwt_key

jwt = JWTManager(app)
db.init_app(app)
with app.app_context():
    db.create_all()

api = Api(app)

api.register_blueprint(register_blueprint)


@jwt.expired_token_loader
def expired_token(jwt_header, jwt_payload):
    return jsonify({"message": "Token expired", "error": "Expired token"}), 401


@jwt.invalid_token_loader
def invalid_token(error):
    return jsonify({"message": "Token invalid", "error": "Invalid token"}), 401


@jwt.unauthorized_loader
def missing_token(error):
    return jsonify({"message": "Token required", "error": "Unauthorized"}), 401


@jwt.token_in_blocklist_loader
def blocklist_token(jwt_header, jwt_payload):
    return jwt_payload['jti'] in BLOCKLIST


@jwt.revoked_token_loader
def revoked_token(jwt_header, jwt_payload):
    return jsonify({"message": "Token invalid", "error": "Unauthorized"}), 401


if __name__ == '__main__':
    app.run(debug=True)
