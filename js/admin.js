// Admin credentials (in a real application, this would be stored securely on the server)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'paddleup2024' // Change this to a secure password
};

// Check if user is logged in
function checkAuth() {
  return localStorage.getItem('adminLoggedIn') === 'true';
}

// Show/hide dashboard based on auth status
function toggleDashboard() {
  const dashboard = document.querySelector('.admin-dashboard');
  const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
  
  if (checkAuth()) {
    dashboard.classList.remove('d-none');
    loadBookings();
    updateStats();
  } else {
    dashboard.classList.add('d-none');
    loginModal.show();
  }
}

// Handle login
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const username = document.getElementById('adminUsername').value;
  const password = document.getElementById('adminPassword').value;
  
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    localStorage.setItem('adminLoggedIn', 'true');
    // Get the modal instance and hide it
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) {
      loginModal.hide();
    }
    // Show the dashboard
    document.querySelector('.admin-dashboard').classList.remove('d-none');
    // Load bookings and update stats
    loadBookings();
    updateStats();
  } else {
    alert('Invalid credentials');
  }
});

// Handle logout
document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('adminLoggedIn');
  toggleDashboard();
});

// Update statistics
function updateStats() {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  const today = new Date().toISOString().split('T')[0];
  
  // Total bookings
  document.getElementById('totalBookings').textContent = bookings.length;
  
  // Pending bookings
  const pending = bookings.filter(b => b.status === 'pending').length;
  document.getElementById('pendingBookings').textContent = pending;
  
  // Confirmed bookings
  const confirmed = bookings.filter(b => b.status === 'confirmed').length;
  document.getElementById('confirmedBookings').textContent = confirmed;
  
  // Today's bookings
  const todayBookings = bookings.filter(b => b.date === today).length;
  document.getElementById('todayBookings').textContent = todayBookings;
}

// Filter and search bookings
function filterBookings() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;
  const dateFilter = document.getElementById('dateFilter').value;
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  
  let filteredBookings = bookings;
  
  // Apply search filter
  if (searchTerm) {
    filteredBookings = filteredBookings.filter(booking => 
      booking.name.toLowerCase().includes(searchTerm) ||
      booking.whatsapp.includes(searchTerm)
    );
  }
  
  // Apply status filter
  if (statusFilter !== 'all') {
    filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
  }
  
  // Apply date filter
  if (dateFilter !== 'all') {
    const today = new Date();
    filteredBookings = filteredBookings.filter(booking => {
      if (!booking.date) return false;
      const bookingDate = new Date(booking.date);
      
      switch (dateFilter) {
        case 'today':
          return bookingDate.toDateString() === today.toDateString();
        case 'week':
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() - today.getDay());
          return bookingDate >= weekStart && bookingDate <= today;
        case 'month':
          return bookingDate.getMonth() === today.getMonth() && 
                 bookingDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
  }
  
  return filteredBookings;
}

// Load bookings from localStorage
function loadBookings() {
  const filteredBookings = filterBookings();
  const tableBody = document.getElementById('bookingsTableBody');
  tableBody.innerHTML = '';
  
  filteredBookings.forEach((booking, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${booking.date || 'Not specified'}</td>
      <td>${booking.time || 'Not specified'}</td>
      <td>
        <div class="d-flex flex-column">
          <span>${booking.name}</span>
          <small class="text-muted">${booking.whatsapp}</small>
        </div>
      </td>
      <td>
        <div class="d-flex flex-column">
          ${booking.kayakQuantity > 0 ? `<span>${booking.kayakQuantity} Kayak${booking.kayakQuantity > 1 ? 's' : ''}</span>` : ''}
          ${booking.paddleQuantity > 0 ? `<span>${booking.paddleQuantity} Paddle Board${booking.paddleQuantity > 1 ? 's' : ''}</span>` : ''}
        </div>
      </td>
      <td>${booking.duration === 'full' ? 'Full Day' : `${booking.duration} hour${booking.duration > 1 ? 's' : ''}`}</td>
      <td>${booking.totalPrice}DT</td>
      <td>
        <span class="badge ${booking.status === 'confirmed' ? 'bg-success' : 'bg-warning'}">
          ${booking.status || 'Pending'}
        </span>
      </td>
      <td>
        <div class="btn-group">
          <button class="btn btn-sm btn-outline-primary" onclick="confirmBooking(${index})">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteBooking(${index})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
  
  updateStats();
}

// Confirm booking
function confirmBooking(index) {
  const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
  bookings[index].status = 'confirmed';
  localStorage.setItem('bookings', JSON.stringify(bookings));
  loadBookings();
}

// Delete booking
function deleteBooking(index) {
  if (confirm('Are you sure you want to delete this booking?')) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    bookings.splice(index, 1);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    loadBookings();
  }
}

// Clear all bookings
document.getElementById('clearBookings').addEventListener('click', function() {
  if (confirm('Are you sure you want to clear all bookings? This action cannot be undone.')) {
    localStorage.removeItem('bookings');
    loadBookings();
  }
});

// Refresh bookings
document.getElementById('refreshBookings').addEventListener('click', loadBookings);

// Add event listeners for filters
document.getElementById('searchInput').addEventListener('input', loadBookings);
document.getElementById('statusFilter').addEventListener('change', loadBookings);
document.getElementById('dateFilter').addEventListener('change', loadBookings);

// Initialize
document.addEventListener('DOMContentLoaded', toggleDashboard); 