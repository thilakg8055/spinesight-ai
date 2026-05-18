# from ultralytics import YOLO
# import uuid
# import os

# # Load model once
# # model = YOLO("yolov8n.pt")
# model = YOLO("models/best.pt")

# def run_inference(image_path):

#     results = model(image_path)

#     result = results[0]

#     output_filename = f"{uuid.uuid4()}.jpg"

#     output_path = os.path.join("outputs", output_filename)

#     # Save annotated image
#     result.save(filename=output_path)

#     detections = []

#     for box in result.boxes:

#         cls_id = int(box.cls[0])
#         confidence = float(box.conf[0])

#         detections.append({
#             "class_id": cls_id,
#             "confidence": round(confidence, 2)
#         })

#     return {
#         "output_image": output_path,
#         "detections": detections
#     }

from ultralytics import YOLO
import uuid
import os

model = YOLO("models/best.pt")

def run_inference(image_path):

    results = model(image_path)

    result = results[0]

    output_filename = f"{uuid.uuid4()}.jpg"
    output_path = os.path.join("outputs", output_filename)

    result.save(filename=output_path)

    detections = []

    for box in result.boxes:

        class_id = int(box.cls[0])
        confidence = float(box.conf[0])

        label = result.names[class_id]

        detections.append({
            "label": label,
            "confidence": round(confidence,2)
        })

    return {
        "output_image": output_path,
        "detections": detections
    }