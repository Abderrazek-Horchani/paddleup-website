// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Booking form functionality
  const form = document.querySelector('.contact-form');
  const steps = document.querySelectorAll('.booking-step');
  const stepIndicators = document.querySelectorAll('.step-indicator');
  const equipmentOptions = document.querySelectorAll('.btn-option');
  const durationOptions = document.querySelectorAll('.btn-duration');
  const equipmentPrice = document.getElementById('equipmentPrice');
  const durationText = document.getElementById('durationText');
  const totalPrice = document.getElementById('totalPrice');
  const submitButton = form.querySelector('button[type="submit"]');

  let currentStep = 1;
  let selectedEquipment = null;
  let selectedDuration = null;

  // Price calculation
  const prices = {
    kayak: 25,
    surfboard: 30,
    both: 50
  };

  const durationDiscounts = {
    1: 0,
    2: 0.1,
    4: 0.2,
    full: 0.25
  };

  function calculatePrice() {
    if (!selectedEquipment || !selectedDuration) {
      equipmentPrice.textContent = '0DT';
      durationText.textContent = '0 hours';
      totalPrice.textContent = '0DT';
      return;
    }

    const basePrice = prices[selectedEquipment];
    const hours = selectedDuration === 'full' ? 8 : parseInt(selectedDuration);
    const discount = durationDiscounts[selectedDuration];
    const total = Math.round(basePrice * hours * (1 - discount));

    equipmentPrice.textContent = `${basePrice}DT/h`;
    durationText.textContent = `${hours} hour${hours > 1 ? 's' : ''}`;
    totalPrice.textContent = `${total}DT`;
  }

  // Step navigation
  function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.booking-step').forEach(step => {
      step.classList.remove('active');
    });
    
    // Show selected step
    document.querySelector(`.booking-step[data-step="${stepNumber}"]`).classList.add('active');
    
    // Update progress indicators
    document.querySelectorAll('.step-indicator').forEach(indicator => {
      if (parseInt(indicator.dataset.step) <= stepNumber) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // Equipment selection
  equipmentOptions.forEach(option => {
    option.addEventListener('click', function() {
      equipmentOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      selectedEquipment = this.dataset.equipment;
      showStep(2);
    });
  });

  // Quantity controls
  const quantityControls = document.querySelectorAll('.quantity-controls');
  quantityControls.forEach(control => {
    const input = control.querySelector('input');
    const decreaseBtn = control.querySelector('[data-action="decrease"]');
    const increaseBtn = control.querySelector('[data-action="increase"]');
    
    decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value);
      if (currentValue > parseInt(input.min)) {
        input.value = currentValue - 1;
        updatePriceSummary();
      }
    });
    
    increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value);
      if (currentValue < parseInt(input.max)) {
        input.value = currentValue + 1;
        updatePriceSummary();
      }
    });
    
    input.addEventListener('change', () => {
      let value = parseInt(input.value);
      if (isNaN(value)) value = 0;
      if (value < parseInt(input.min)) value = parseInt(input.min);
      if (value > parseInt(input.max)) value = parseInt(input.max);
      input.value = value;
      updatePriceSummary();
    });
  });
  
  // Add kayak selection button handler
  const kayakSelectBtn = document.querySelector('.kayak-select-btn');
  if (kayakSelectBtn) {
    kayakSelectBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      if (this.classList.contains('active')) {
        this.innerHTML = '<i class="fas fa-check-circle me-1"></i> Kayak Selected';
        this.classList.remove('btn-outline-primary');
        this.classList.add('btn-primary');
      } else {
        this.innerHTML = '<i class="fas fa-plus-circle me-1"></i> Select Kayak';
        this.classList.remove('btn-primary');
        this.classList.add('btn-outline-primary');
      }
      updatePriceSummary();
    });
  }

  // Update price summary
  function updatePriceSummary() {
    const kayakQuantity = parseInt(document.querySelector('#kayakQuantity').value);
    const paddleQuantity = parseInt(document.querySelector('#paddleQuantity').value);
    const duration = document.querySelector('.btn-duration.active')?.dataset.duration;
    
    let equipmentText = '';
    if (kayakQuantity > 0) {
      equipmentText += `${kayakQuantity} kayak${kayakQuantity > 1 ? 's' : ''}`;
    }
    if (paddleQuantity > 0) {
      if (equipmentText) equipmentText += ' and ';
      equipmentText += `${paddleQuantity} paddle board${paddleQuantity > 1 ? 's' : ''}`;
    }
    
    document.getElementById('equipmentSummary').textContent = equipmentText || 'No equipment selected';
    
    // Update duration text
    if (duration) {
      const hours = duration === 'full' ? 'Full Day' : `${duration} hour${duration > 1 ? 's' : ''}`;
      durationText.textContent = hours;
    } else {
      durationText.textContent = 'No duration selected';
    }
    
    // Update total price if duration is selected
    if (duration) {
      const kayakPrice = 25; // 25DT per kayak
      const paddlePrice = 30; // 30DT per paddle board
      
      let totalPrice = (kayakQuantity * kayakPrice) + (paddleQuantity * paddlePrice);
      
      // Apply duration multiplier
      const durationMultiplier = duration === 'full' ? 8 : parseInt(duration);
      totalPrice *= durationMultiplier;
      
      // Apply discounts
      if (duration === '2') totalPrice *= 0.9; // 10% discount
      else if (duration === '4') totalPrice *= 0.8; // 20% discount
      else if (duration === 'full') totalPrice *= 0.75; // 25% discount
      
      document.getElementById('totalPrice').textContent = `${Math.round(totalPrice)}DT`;
    } else {
      document.getElementById('totalPrice').textContent = '0DT';
    }
  }

  // Set minimum date to today
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${year}-${month}-${day}`;
  }

  // Duration selection
  const durationButtons = document.querySelectorAll('.btn-duration');
  durationButtons.forEach(button => {
    button.addEventListener('click', function() {
      durationButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      updatePriceSummary();
    });
  });

  // Continue to Contact button handler
  const continueToContactBtn = document.getElementById('continueToContact');
  if (continueToContactBtn) {
    continueToContactBtn.addEventListener('click', function() {
      const duration = document.querySelector('.btn-duration.active')?.dataset.duration;
      if (!duration) {
        alert('Please select a duration to continue');
        return;
      }
      showStep(3);
    });
  }

  // Continue to Duration button handler
  const continueToDurationBtn = document.getElementById('continueToDuration');
  if (continueToDurationBtn) {
    continueToDurationBtn.addEventListener('click', function() {
      const kayakQuantity = parseInt(document.querySelector('#kayakQuantity').value);
      const paddleQuantity = parseInt(document.querySelector('#paddleQuantity').value);
      
      if (kayakQuantity === 0 && paddleQuantity === 0) {
        alert('Please select at least one kayak or paddle board to continue');
        return;
      }
      
      showStep(2);
    });
  }

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const kayakQuantity = parseInt(document.querySelector('#kayakQuantity').value);
    const paddleQuantity = parseInt(document.querySelector('#paddleQuantity').value);
    const duration = document.querySelector('.btn-duration.active')?.dataset.duration;
    const bookingDate = document.getElementById('bookingDate').value;
    const bookingTime = document.getElementById('bookingTime').value;
    
    if (!name || !whatsapp) {
      alert('Please fill in all required fields');
      return;
    }

    // Calculate total price
    const kayakPrice = 25; // 25DT per kayak
    const paddlePrice = 30; // 30DT per paddle board
    let totalPrice = (kayakQuantity * kayakPrice) + (paddleQuantity * paddlePrice);
    const durationMultiplier = duration === 'full' ? 8 : parseInt(duration);
    totalPrice *= durationMultiplier;
    
    // Apply discounts
    if (duration === '2') totalPrice *= 0.9; // 10% discount
    else if (duration === '4') totalPrice *= 0.8; // 20% discount
    else if (duration === 'full') totalPrice *= 0.75; // 25% discount
    
    // Store booking in localStorage
    const booking = {
      name,
      whatsapp,
      kayakQuantity,
      paddleQuantity,
      duration,
      date: bookingDate,
      time: bookingTime,
      totalPrice: Math.round(totalPrice),
      status: 'pending',
      timestamp: new Date().toISOString()
    };
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Create WhatsApp message
    let message = `*New Booking Request*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${name}\n`;
    message += `WhatsApp: ${whatsapp}\n\n`;
    message += `*Booking Details:*\n`;
    if (kayakQuantity > 0) {
      message += `Kayaks: ${kayakQuantity}\n`;
    }
    if (paddleQuantity > 0) {
      message += `Paddle Boards: ${paddleQuantity}\n`;
    }
    message += `Duration: ${duration === 'full' ? 'Full Day' : `${duration} hour${duration > 1 ? 's' : ''}`}\n`;
    if (bookingDate) {
      message += `Date: ${bookingDate}\n`;
    }
    if (bookingTime) {
      message += `Time: ${bookingTime}\n`;
    }
    message += `Total Price: ${Math.round(totalPrice)}DT\n`;
    
    // Encode message for WhatsApp URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
    
    // Reset form
    this.reset();
    document.querySelector('#kayakQuantity').value = '0';
    document.querySelector('#paddleQuantity').value = '0';
    updatePriceSummary();
    
    // Show success message
    alert('Booking request sent successfully! Please check your WhatsApp to confirm the booking.');
  });

  // Initialize price summary
  updatePriceSummary();

  // Initialize
  calculatePrice();
}); 