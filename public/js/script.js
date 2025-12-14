// Set today's date as default for createdDate
document.getElementById('createdDate').valueAsDate = new Date();

const priceInput = document.getElementById('price');
const qtyInput = document.getElementById('qty');
const amountInput = document.getElementById('amount');
const form = document.querySelector('form');

function calculateAmount() {
    const price = parseFloat(priceInput.value) || 0;
    const qty = parseFloat(qtyInput.value) || 0;
    const amount = price * qty;
    amountInput.value = amount.toFixed(2);
}

priceInput.addEventListener('input', calculateAmount);
qtyInput.addEventListener('input', calculateAmount);

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    const data = {
        productName: document.getElementById('productName').value,
        categoryName: document.getElementById('categoryName').value,
        createdDate: document.getElementById('createdDate').value,
        price: priceInput.value,
        qty: qtyInput.value,
        amount: amountInput.value,
        description: document.getElementById('description').value
    };

    try {
        const response = await fetch('/api/submit-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            alert('Product Created and Notification Sent!');
            form.reset();
            document.getElementById('createdDate').valueAsDate = new Date();
            calculateAmount();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred: ' + (error.message || JSON.stringify(error)));
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});