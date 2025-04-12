from flask import Blueprint, render_template, session, redirect
import xml.etree.ElementTree as ET
from app.db import get_active_records_count
import os

home_bp = Blueprint('home', __name__)

def get_posts_from_xml():
    try:
        file_path = os.path.join(os.path.dirname(__file__), '../static/posts.xml')
        tree = ET.parse(file_path)
        root = tree.getroot()
        posts = []
        for post in root.findall("post"):
            posts.append({
                "title": post.find("title").text,
                "link": post.find("link").text,
                "image_url": post.find("image_url").text,
                "first_sentence": post.find("first_sentence").text
            })
        return posts
    except FileNotFoundError:
        return []

@home_bp.route("/check_token")
def check():
    token = session.get('access_token')
    return token if token else None

@home_bp.route("/logout", methods=["POST"])
def logout():
    session.clear()
    return redirect("/")

@home_bp.route("/")
def home():
    active_records_count = get_active_records_count()
    posts = get_posts_from_xml()
    check_auth = check()
    return render_template("main.html", active_records_count=active_records_count, posts=posts, check_auth=check_auth)