FROM python:3.9
WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "ai_module.py"]
EXPOSE 5001