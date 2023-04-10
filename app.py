from flask import Flask, render_template, url_for,jsonify, request, redirect,Response
import torch
import cv2
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# Load the YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='model/best.pt')
model.eval()

def gen():
    cap=cv2.VideoCapture(0)
    # Read until video is completed
    while(cap.isOpened()):
        
        # Capture frame-by-fram ## read the camera frame
        success, frame = cap.read()
        if success == True:
            ret,buffer=cv2.imencode('.jpg',frame)
            frame=buffer.tobytes()
            img = Image.open(io.BytesIO(frame))
            results = model(img, size=416)
            results.print()  # print results to screen
            #convert remove single-dimensional entries from the shape of an array
            img = np.squeeze(results.render()) #RGB
            # read image as BGR
            img_BGR = cv2.cvtColor(img, cv2.COLOR_RGB2BGR) #BGR
            
        else:
            break

        # Encode BGR image to bytes so that cv2 will convert to RGB
        frame = cv2.imencode('.jpg', img_BGR)[1].tobytes()
        yield(b'--frame\r\n'b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def hello_world():
   return render_template('index.html')

@app.route('/upload_page')
def upload_page():
    return render_template('upload.html')

@app.route('/webcam_page')
def webcam_page():
    return render_template('webcam.html')

@app.route('/video',methods=["GET"])
def video():
    model.conf = 0.8  # confidence threshold (0-1)
    model.iou = 0.45  # NMS IoU threshold (0-1) 
    return Response(gen(),mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/upload-image', methods=["POST"])
def upload_image():
    model.conf = 0.2  # confidence threshold (0-1)
    model.iou = 0.45  # NMS IoU threshold (0-1) 
    #get the uploaded image
    file = request.files.get("image")
    object_names=[]
    object_scores=[]
    
    # Read the image file into a numpy array
    image_np = np.frombuffer(file.read(), np.uint8)
    image_np = cv2.imdecode(image_np, cv2.IMREAD_COLOR)
    
    # Perform object detection using YOLOv5
    results = model(image_np)
    # Draw bounding boxes around the detected objects in the image
    for result in results.xyxy[0]:
        x1, y1, x2, y2, confidence, class_id = result
        object_names.append(model.names[int(class_id)])
        object_scores.append(f'{confidence * 100:.2f}%');
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        cv2.rectangle(image_np, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(image_np, f'{model.names[int(class_id)]} {confidence:.2f}', (x1, y2 - 10), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 255, 0), 2)
       
    # Convert the resulting image to a JPEG image buffer for display in the browser
    _, image_buffer = cv2.imencode('.jpg', image_np)
    image_data = image_buffer.tobytes() 
    
    if file:
        filename = file.filename
        with open("static/outputs/"+filename, "wb") as f:
            f.write(image_data)
        name = "static/outputs/"+str(filename)
        response = {'name':name, 'object_n':object_names,'object_s':object_scores };
        return jsonify(response);
    return jsonify(error="No image file received")

if __name__ == '__main__':
   app.run(debug=True);