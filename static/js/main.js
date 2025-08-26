
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const resultContainer = document.getElementById('resultContainer');
    const errorContainer = document.getElementById('errorContainer');
    const predictBtn = document.getElementById('predictBtn');

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        showLoading(true);
        hideResults();
        
        // Get form data
        const formData = new FormData(form);
        // const data = Object.fromEntries(formData.entries());
        
        try {
            // Make prediction request
            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && !result.error) {
                showResult(result);
            } else {
                showError(result.error || 'Unknown error occurred');
            }

        } catch (error) {
            console.error('Prediction error:', error);
            showError('Network error. Please check your connection and try again.');
        } finally {
            showLoading(false);
        }
    });

    function showLoading(show) {
        loadingSpinner.style.display = show ? 'block' : 'none';
        predictBtn.disabled = show;
        predictBtn.innerHTML = show ? 
            '<i class="fas fa-spinner fa-spin"></i> Predicting...' : 
            '<i class="fas fa-magic"></i> Predict Subscription';
    }

    function hideResults() {
        resultContainer.style.display = 'none';
        errorContainer.style.display = 'none';
    }

    function showResult(result) {
        const resultAlert = document.getElementById('resultAlert');
        const resultIcon = document.getElementById('resultIcon');
        const resultTitle = document.getElementById('resultTitle');
        const resultMessage = document.getElementById('resultMessage');

        console.log("RESULT+++++++++++++++++++++++++++",result);

        // Determine result type
        const isPositive = result.prediction === '1';

        // Set alert class
        resultAlert.className = `alert ${isPositive ? 'alert-success' : 'alert-warning'}`;

        // Set icon and title
        resultIcon.className = `fas ${isPositive ? 'fa-check-circle' : 'fa-times-circle'}`;
        resultTitle.textContent = isPositive ? 
            'High Subscription Likelihood' : 
            'Low Subscription Likelihood';

        // Set message
        resultMessage.textContent = isPositive ? 
            `This client is likely to subscribe to a term deposit.` :
            `This client is unlikely to subscribe to a term deposit.`;

        // Show result
        resultContainer.style.display = 'block';

        // Scroll to result
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showError(errorMessage) {
        document.getElementById('errorMessage').textContent = errorMessage;
        errorContainer.style.display = 'block';
        
        // Scroll to error
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Form validation enhancements
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            this.classList.remove('is-invalid');
            if (this.checkValidity()) {
                this.classList.add('is-valid');
            }
        });
    });
});