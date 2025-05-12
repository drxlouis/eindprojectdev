document.addEventListener('DOMContentLoaded', function() {
  // Cart state
  const cart = {
    items: {},
    count: 0,
    
    // Add item to cart
    addItem: function(id, name, price) {
      if (this.items[id]) {
        this.items[id].quantity++;
      } else {
        this.items[id] = {
          name: name,
          price: price,
          quantity: 1
        };
      }
      this.count++;
      this.updateCartDisplay();
    },
    
    // Remove item from cart
    removeItem: function(id) {
      if (this.items[id]) {
        this.count -= this.items[id].quantity;
        delete this.items[id];
        this.updateCartDisplay();
      }
    },
    
    // Update item quantity
    updateQuantity: function(id, quantity) {
      if (this.items[id]) {
        const oldQuantity = this.items[id].quantity;
        this.items[id].quantity = quantity;
        this.count += (quantity - oldQuantity);
        
        if (quantity <= 0) {
          this.removeItem(id);
        } else {
          this.updateCartDisplay();
        }
      }
    },
    
    // Increment item quantity
    incrementItem: function(id) {
      if (this.items[id]) {
        this.items[id].quantity++;
        this.count++;
        this.updateCartDisplay();
      }
    },
    
    // Decrement item quantity
    decrementItem: function(id) {
      if (this.items[id] && this.items[id].quantity > 1) {
        this.items[id].quantity--;
        this.count--;
        this.updateCartDisplay();
      } else if (this.items[id]) {
        this.removeItem(id);
      }
    },
    
    // Calculate subtotal
    calculateSubtotal: function() {
      let subtotal = 0;
      for (const id in this.items) {
        subtotal += this.items[id].price * this.items[id].quantity;
      }
      return subtotal;
    },
    
    // Clear entire cart
    clearCart: function() {
      this.items = {};
      this.count = 0;
      this.updateCartDisplay();
    },
    
    // Update cart display in UI
    updateCartDisplay: function() {
      // Update cart counter
      const cartCountElements = document.querySelectorAll('[data-cart-count]');
      cartCountElements.forEach(el => {
        el.textContent = this.count;
      });
      
      // Get container for cart items
      const cartItemsContainer = document.getElementById('cart-items');
      if (!cartItemsContainer) return;
      
      // Update cart items display
      let cartHTML = '';
      
      if (this.count > 0) {
        for (const id in this.items) {
          const item = this.items[id];
          const itemTotal = item.price * item.quantity;
          
          cartHTML += `
            <div class="d-flex justify-content-between align-items-center mb-3 pb-3 border-bottom" data-item-id="${id}">
              <div>
                <h6 class="mb-0">${item.name}</h6>
                <small class="text-muted">€${item.price.toFixed(2)} each</small>
              </div>
              <div class="d-flex align-items-center">
                <span class="px-2">${item.quantity}x</span>
                <span class="text-nowrap ms-2">€${itemTotal.toFixed(2)}</span>
                <button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-id="${id}">&times;</button>
              </div>
            </div>
          `;
        }
      } else {
        cartHTML = '<p class="text-center text-muted">Your cart is empty</p>';
      }
      
      // Calculate totals
      const subtotal = this.calculateSubtotal();
      
      // Update DOM for totals
      cartItemsContainer.innerHTML = cartHTML;
      
      // Update monetary displays
      const subtotalElement = document.getElementById('subtotal');
      const totalElement = document.getElementById('total');
      
      if (subtotalElement) subtotalElement.textContent = '€' + subtotal.toFixed(2);
      if (totalElement) totalElement.textContent = '€' + subtotal.toFixed(2);
      
      // Add event listeners to the newly created buttons
      this.addCartButtonListeners();
    },
    
    // Add event listeners to cart buttons
    addCartButtonListeners: function() {
      // Add event listeners for remove buttons
      document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
          const id = e.target.getAttribute('data-id');
          this.removeItem(id);
        });
      });
    }
  };
  
  // Initialize event listeners for menu items
  function initializeMenuListeners() {
    // Add to cart button listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', function() {
        const itemId = this.getAttribute('data-id');
        const itemCard = this.closest('.card-food');
        const itemName = itemCard.querySelector('.card-title').innerText;
        const itemPrice = parseFloat(itemCard.querySelector('.fw-bold').innerText.replace('$', ''));
        
        cart.addItem(itemId, itemName, itemPrice);
      });
    });
    
    // Category filter listeners
    document.querySelectorAll('.category-pill').forEach(pill => {
      pill.addEventListener('click', function() {
        // Remove active class from all pills
        document.querySelectorAll('.category-pill').forEach(p => {
          p.classList.remove('active');
        });
        
        // Add active class to clicked pill
        this.classList.add('active');
        
        const category = this.getAttribute('data-category');
        filterMenuItems(category);
      });
    });
    
    // Checkout button listener
    const checkoutButton = document.querySelector('.checkout-btn');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', function() {
        if (cart.count > 0) {
          alert('Proceeding to checkout with ' + cart.count + ' items. Your total is €' + cart.calculateSubtotal().toFixed(2));
          // Here you would normally redirect to checkout page or process the order
        } else {
          alert('Your cart is empty');
        }
      });
    }
  }
  
  // Filter menu items by category
  function filterMenuItems(category) {
    const allItems = document.querySelectorAll('.menu-item');
    
    if (category === 'all') {
      // Show all items
      allItems.forEach(item => {
        item.style.display = 'block';
      });
    } else {
      // Filter items by category
      allItems.forEach(item => {
        if (item.getAttribute('data-category') === category) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    }
  }
  
  // Initialize menu and cart
  function init() {
    initializeMenuListeners();
    cart.updateCartDisplay();
  }
  
  // Run initialization
  init();
  
  // Make cart globally accessible
  window.foodCart = cart;
});