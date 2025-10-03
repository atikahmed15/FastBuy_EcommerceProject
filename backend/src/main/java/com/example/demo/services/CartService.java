package com.example.demo.services;

import com.example.demo.entities.CartItem;
import com.example.demo.entities.Product;
import com.example.demo.entities.ProductImage;
import com.example.demo.entities.User;
import com.example.demo.repositories.CartRepository;
import com.example.demo.repositories.ProductImageRepository;
import com.example.demo.repositories.ProductRepository;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    // Get total cart item count for a user
    public int getCartItemCount(int userId) {
        return cartRepository.countTotalItems(userId);
    }

    // Add item to cart
    public void addToCart(int userId, int productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        Optional<CartItem> existingItem = cartRepository.findByUserAndProduct(userId, productId);
        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            cartRepository.save(cartItem);
        } else {
            CartItem newItem = new CartItem(user, product, quantity);
            cartRepository.save(newItem);
        }
    }

    // Get cart items for a user
    public Map<String, Object> getCartItems(int userId) {
        List<CartItem> cartItems = cartRepository.findCartItemsWithProductDetails(userId);
        Map<String, Object> response = new HashMap<>();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        response.put("username", user.getUsername());
        response.put("role", user.getRole().toString());

        List<Map<String, Object>> products = new ArrayList<>();
        double overallTotalPrice = 0.0;

        for (CartItem cartItem : cartItems) {
            Map<String, Object> productDetails = new HashMap<>();
            Product product = cartItem.getProduct();

            List<ProductImage> productImages = productImageRepository.findByProduct_ProductId(product.getProductId());
            String imageUrl = (productImages != null && !productImages.isEmpty()) ?
                    productImages.get(0).getImageUrl() : "default-image-url";

            productDetails.put("product_id", product.getProductId());
            productDetails.put("image_url", imageUrl);
            productDetails.put("name", product.getName());
            productDetails.put("description", product.getDescription());
            productDetails.put("price_per_unit", product.getPrice());
            productDetails.put("quantity", cartItem.getQuantity());
            productDetails.put("total_price", cartItem.getQuantity() * product.getPrice().doubleValue());

            products.add(productDetails);
            overallTotalPrice += cartItem.getQuantity() * product.getPrice().doubleValue();
        }

        Map<String, Object> cart = new HashMap<>();
        cart.put("products", products);
        cart.put("overall_total_price", overallTotalPrice);

        response.put("cart", cart);
        return response;
    }

    // Update cart item quantity
    public void updateCartItemQuantity(int userId, int productId, int quantity) {
        Optional<CartItem> existingItem = cartRepository.findByUserAndProduct(userId, productId);
        if (existingItem.isPresent()) {
            CartItem cartItem = existingItem.get();
            if (quantity == 0) {
                deleteCartItem(userId, productId);
            } else {
                cartItem.setQuantity(quantity);
                cartRepository.save(cartItem);
            }
        }
    }

    // Delete cart item
    public void deleteCartItem(int userId, int productId) {
        cartRepository.deleteCartItem(userId, productId);
    }
}
