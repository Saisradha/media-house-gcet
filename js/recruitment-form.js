/**
 * Media House GCET - Recruitment Form & Registration Handler
 */

const REGISTRATION_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXi06opwP1jtf4LwyMKFPMbHa5zdeGGKfDNN1a_SGJ856PKXrw4UlEsT4bjTFTm4M/exec';

function openRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeRegistrationModal() {
    const modal = document.getElementById('registrationModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close on outside click
window.addEventListener('click', function(event) {
    const modal = document.getElementById('registrationModal');
    if (modal && event.target === modal) {
        closeRegistrationModal();
    }
});

async function submitRegistrationForm(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('regSubmitBtn');
    const statusMessage = document.getElementById('regStatusMessage');
    const form = document.getElementById('registrationForm');
    
    if (!submitBtn || !statusMessage || !form) return;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusMessage.textContent = '';
    statusMessage.className = 'mt-4 text-center text-sm';
    
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    data.timestamp = new Date().toISOString();
    
    try {
        await fetch(REGISTRATION_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        statusMessage.textContent = '✅ Application submitted successfully! We\'ll contact you soon.';
        statusMessage.className = 'mt-4 text-center text-sm text-green-400';
        form.reset();
        
        setTimeout(() => {
            closeRegistrationModal();
            statusMessage.textContent = '';
        }, 2500);
        
    } catch (error) {
        console.error('Registration Submission Error:', error);
        statusMessage.textContent = '❌ Something went wrong. Please try again or contact us directly.';
        statusMessage.className = 'mt-4 text-center text-sm text-red-400';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
    }
}
