from flask import Blueprint, render_template, jsonify, session, redirect

privacy_policy_bp = Blueprint('privacy_policy', __name__)

@privacy_policy_bp.route("/check_token")
def check():
    token = session.get('access_token')
    return token if token else None

@privacy_policy_bp.route("/privacy-policy")
def privacy_policy():
    check_auth = check()
    return render_template("confidentiality.html", check_auth=check_auth)

@privacy_policy_bp.route("/logout/privacy-policy", methods=["POST"])
def logout():
    session.clear()
    return redirect("/privacy-policy")