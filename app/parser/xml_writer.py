import xml.etree.ElementTree as ET
import os

def write_to_xml(posts, filename):
    """Запись новостей в XML файл"""
    static_folder = os.path.join(os.path.dirname(__file__), '../static')
    os.makedirs(static_folder, exist_ok=True)

    file_path = os.path.join(static_folder, filename)
    
    root = ET.Element("posts")
    for post in posts:
        post_element = ET.SubElement(root, "post")
        ET.SubElement(post_element, "title").text = post["title"]
        ET.SubElement(post_element, "link").text = post["link"]
        ET.SubElement(post_element, "image_url").text = post["image_url"]
        ET.SubElement(post_element, "first_sentence").text = post["first_sentence"]

    tree = ET.ElementTree(root)
    tree.write(file_path, encoding="utf-8", xml_declaration=True)
    print(f"Файл {filename} сохранён в {file_path}")