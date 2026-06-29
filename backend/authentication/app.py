from flask import Flask, render_template, request, redirect, session, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import os


# ==========================================
# PATH SETUP
# ==========================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

STATIC_DIR = os.path.abspath(
    os.path.join(BASE_DIR, "../../frontend/style")
)

TEMPLATE_DIR = os.path.abspath(
    os.path.join(BASE_DIR, "../../frontend/templates")
)

GAME_DIR = os.path.abspath(
    os.path.join(BASE_DIR, "../../frontend/game/dash")
)

DB_PATH = os.path.join(BASE_DIR, "phisgo.db")


# ==========================================
# FLASK APP
# ==========================================

app = Flask(
    __name__,
    static_folder=STATIC_DIR,
    static_url_path="/style",
    template_folder=TEMPLATE_DIR
)

# IMPORTANT:
# Do not use os.urandom() here because
# users get logged out after restart
app.config["SECRET_KEY"] = os.getenv(
    "SECRET_KEY",
    "phisgo_dev_secret_key"
)


# ==========================================
# DATABASE
# ==========================================

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db()

    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    conn.commit()
    conn.close()


init_db()


# ==========================================
# ROUTES
# ==========================================

@app.route("/")
def index():

    if session.get("user_id"):
        return redirect("/dash/user_view")

    return render_template("index.html")


@app.route("/dashboard")
def dashboard():

    if not session.get("user_id"):
        return redirect("/")

    return render_template("dashboard.html")

#=============================================
#MISSion
#=============================================

MISSION_DIR = os.path.abspath(
    os.path.join(
        BASE_DIR,
        "../../frontend/mission1_html"
    )
)

MISSION_SUCCESS_DIR = os.path.abspath(
    os.path.join(
        BASE_DIR,
        "../../frontend/mission"
    )
)

@app.route("/mission1")
def mission1():
    if not session.get("user_id"):
        return redirect("/")
    path = os.path.join(
        MISSION_DIR,
        "mission1.html"
    )
    with open(
        path, "r", encoding="utf-8"
    ) as file:
        return file.read(
    )

@app.route("/mission1.css")
def mission1_css():
    with open(
        os.path.join(
            MISSION_SUCCESS_DIR,
            "mission1.css"
        ),
        encoding="utf-8"
    ) as file:
        return ( file.read(), 200, {
            "Content-Type": "text/css"
        }
        )
    
@app.route("/mission1.js")
def mission1_js():
    with open(
        os.path.join(
            MISSION_SUCCESS_DIR,
            "mission1.js"
        ),
        encoding="utf-8"
    ) as file:
        return ( file.read(), 200, {
            "Content-Type": "application/javascript"
        }
        )
        
@app.route("/mission_success")
def mission_success():
    if not session.get("user_id"):
        return redirect("/")
    path = os.path.join(
        MISSION_DIR, 
        "mission_success.html"
    )
    
    with open(
        path, 
        "r",
        encoding="utf-8"
    ) as file:
        return file.read()
    
    
@app.route("/mission_failed")
def mission_failed():
    if not session.get("user_id"):
        return redirect("/")
    path = os.path.join(
        MISSION_DIR, 
        "mission_failed.html"
    )
    with open(
        path, 
        "r",
        encoding="utf-8"
    ) as file:
        return file.read()
    
@app.route("/mission_success.css")
def mission_success_css():

    with open(
        os.path.join(
            MISSION_SUCCESS_DIR,
            "mission_success.css"
        ),
        encoding="utf-8"
    ) as file:

        return (
            file.read(),
            200,
            {
                "Content-Type":
                "text/css"
            }
        )


@app.route("/mission_failed.css")
def mission_failed_css():

    with open(
        os.path.join(
            MISSION_SUCCESS_DIR,
            "mission_failed.css"
        ),
        encoding="utf-8"
    ) as file:

        return (
            file.read(),
            200,
            {
                "Content-Type":
                "text/css"
            }
        )
    
    
@app.route("/dash/user_view")
def user_view():

    if not session.get("user_id"):
        return redirect("/")

    path = os.path.join(
        GAME_DIR,
        "user_view.html"
    )

    with open(path, "r", encoding="utf-8") as file:
        return file.read()


@app.route("/dash/user_view.css")
def user_view_css():

    path = os.path.join(
        GAME_DIR,
        "user_view.css"
    )

    with open(path, "r", encoding="utf-8") as file:
        return (
            file.read(),
            200,
            {
                "Content-Type": "text/css"
            }
        )


@app.route("/dash/user_view.js")
def user_view_js():

    path = os.path.join(
        GAME_DIR,
        "user_view.js"
    )

    with open(path, "r", encoding="utf-8") as file:
        return (
            file.read(),
            200,
            {
                "Content-Type":
                "application/javascript"
            }
        )


# ==========================================
# LOGIN
# ==========================================

@app.route(
    "/api/login",
    methods=["POST"]
)
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    conn = get_db()

    user = conn.execute(
        """
        SELECT *
        FROM users
        WHERE email=?
        """,
        (email,)
    ).fetchone()

    conn.close()

    if not user:
        return jsonify({
            "success": False,
            "message":
            "Credentials do not match."
        }), 401

    if not check_password_hash(
        user["password"],
        password
    ):
        return jsonify({
            "success": False,
            "message":
            "Credentials do not match."
        }), 401

    session["user_id"] = user["id"]
    session["username"] = user["username"]

    return jsonify({
        "success": True,
        "redirect":
        "/dash/user_view"
    })


# ==========================================
# SIGNUP
# ==========================================

@app.route(
    "/api/signup",
    methods=["POST"]
)
def signup():

    data = request.get_json()

    username = data.get(
        "username",
        ""
    ).strip()

    email = data.get(
        "email",
        ""
    ).strip()

    password = data.get("password")

    confirm_password = data.get(
        "confirm_password"
    )

    if (
        not username
        or not email
        or not password
    ):
        return jsonify({
            "success": False,
            "message":
            "All fields required."
        }), 400

    if password != confirm_password:
        return jsonify({
            "success": False,
            "message":
            "Passwords do not match."
        }), 400

    hashed = generate_password_hash(
        password
    )
    conn = None 

    try:

        conn = sqlite3.connect(DB_PATH, timeout=10)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO users
            (
                username,
                email,
                password
            )
            VALUES
            (?, ?, ?)
            """,
            (
                username,
                email,
                hashed
            )
        )

        conn.commit()

        user_id = cursor.lastrowid

        

        session["user_id"] = user_id
        session["username"] = username

        return jsonify({
            "success": True,
            "redirect":
            "/dashboard"
        })

    except sqlite3.IntegrityError:

        return jsonify({
            "success": False,
            "message":
            "Email already exists."
        }), 400
    
    finally:
        if conn:
            conn.close()
# ==========================================
# LOGOUT
# ==========================================

@app.route("/logout")
def logout():

    session.clear()

    return redirect("/")


# ==========================================
# RUN
# ==========================================

if __name__ == "__main__":

    app.run(
        debug=True
    )