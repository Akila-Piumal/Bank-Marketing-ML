# Use the official AWS Lambda Python base image
FROM public.ecr.aws/lambda/python:3.10

# Set working directory inside the image
WORKDIR /var/task

# Install Python dependencies to the image layer
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code and artifacts
COPY main.py .
COPY static ./static
COPY index.html .
COPY artifacts ./artifacts


# Set the Lambda handler (module.function)
# Our handler is defined in main.py as `handler = Mangum(app)`
CMD ["main.handler"]
