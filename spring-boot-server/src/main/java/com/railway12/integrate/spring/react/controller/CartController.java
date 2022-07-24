package com.railway12.integrate.spring.react.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.railway12.integrate.spring.react.model.Cart;
import com.railway12.integrate.spring.react.model.User;
import com.railway12.integrate.spring.react.repository.CartRepository;
import com.railway12.integrate.spring.react.repository.UserRepository;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class CartController {

	@Autowired
	CartRepository cartRepository;  
	
	@Autowired
	UserRepository userRepository;
	
	double amountCheck = 0;

	@GetMapping("/carts")
	@PreAuthorize("hasRole('USER') or hasRole('VTI') or hasRole('ADMIN')")
	public ResponseEntity<Map<String, Object>> getAllCarts(
	        @RequestParam(required = false) String title,
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "3") int size
	      ) {
	    try {
	      List<Cart> carts = new ArrayList<Cart>();
	      Pageable paging = PageRequest.of(page, size);
	      
	      Page<Cart> pageTuts;
	      if (title == null)
	        pageTuts = cartRepository.findAll(paging);
	      else
	        pageTuts = cartRepository.findByTitleContaining(title, paging);

	      carts = pageTuts.getContent();

	      Map<String, Object> response = new HashMap<>();
	      response.put("Carts", carts);
	      response.put("currentPage", pageTuts.getNumber());
	      response.put("totalItems", pageTuts.getTotalElements());
	      response.put("totalPages", pageTuts.getTotalPages());

	      return new ResponseEntity<>(response, HttpStatus.OK);
	    } catch (Exception e) {
	      return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	  }

	@GetMapping("/carts/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('VTI') or hasRole('ADMIN')")
	public ResponseEntity<Cart> getcartById(@PathVariable("id") long id) {
		Optional<Cart> cartData = cartRepository.findById(id);

		if (cartData.isPresent()) {
			return new ResponseEntity<>(cartData.get(), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/carts")
	@PreAuthorize("hasRole('USER') or hasRole('VTI') or hasRole('ADMIN')")
	public ResponseEntity<Cart> createcart(@RequestBody Cart cart) {
		try {
			Cart _cart = cartRepository
					.save(new Cart(cart.getTitle(), cart.getDescription(), false, cart.getAmount(), cart.getImgUrl()));
			return new ResponseEntity<>(_cart, HttpStatus.CREATED);
		} catch (Exception e) {
			return new ResponseEntity<>(null, HttpStatus.EXPECTATION_FAILED);
		}
	}

	@PutMapping("/carts/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('VTI') or hasRole('ADMIN')")
	public ResponseEntity<Cart> updatecart(@PathVariable("id") long id, @RequestBody Cart cart) {
		Optional<Cart> cartData = cartRepository.findById(id);

		if (cartData.isPresent()) {
			Cart _cart = cartData.get();
			_cart.setTitle(cart.getTitle());
			_cart.setDescription(cart.getDescription());
			_cart.setIsPaid(cart.getIsPaid());
			_cart.setAmount(cart.getAmount());
			return new ResponseEntity<>(cartRepository.save(_cart), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@DeleteMapping("/carts/{id}")
	@PreAuthorize("hasRole('USER') or hasRole('VTI') or hasRole('ADMIN')")
	public ResponseEntity<HttpStatus> deletecart(@PathVariable("id") long id) {
		try {
			cartRepository.deleteById(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
		}
	}

	@PutMapping("/payment/{sumAmount}")
	@PreAuthorize("hasRole('USER') or hasRole('VTI') or hasRole('ADMIN')")
	public ResponseEntity<Object> payAll(@PathVariable("sumAmount") double sumAmount) {
		try {
			List<Cart> listCart = cartRepository.findAll();	
			listCart.stream().forEach(x -> {
				amountCheck += x.getAmount();
				});
			if(amountCheck != sumAmount) {
				return new ResponseEntity<>("Thanh toán lỗi vui lòng thử lại",HttpStatus.EXPECTATION_FAILED);
			}
			Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
	        if (authentication == null || !authentication.isAuthenticated()) {
	            return null;
	        }
	        UserDetails user;
	        Object principal = authentication.getPrincipal();
	        if (principal instanceof UserDetails) {
	        	user = ((UserDetails)principal);
	        } else {
	        	user = null;
	        }
	        if(user == null) {
	        	return new ResponseEntity<>("Thanh toán lỗi vui lòng thử lại",HttpStatus.EXPECTATION_FAILED);
	        }
			User userLogin = userRepository.findByUsername(user.getUsername()).get();
			if(userLogin.getWalletCast() < amountCheck) {
				return new ResponseEntity<>("Không đủ tiền để thanh toán",HttpStatus.EXPECTATION_FAILED);
			}
			userLogin.setWalletCast(userLogin.getWalletCast() - amountCheck);
			userRepository.save(userLogin);
			listCart.stream().forEach(x -> {
				x.setIsPaid(true);
				cartRepository.save(x);
			});
			return new ResponseEntity<>("Thanh toán thành công",HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
		}

	}

	@GetMapping("/carts/isPaid")
	@PreAuthorize("hasRole('USER') or hasRole('VTI') or hasRole('ADMIN')")
	public ResponseEntity<Map<String, Object>> findByPublished(
	        @RequestParam(defaultValue = "0") int page,
	        @RequestParam(defaultValue = "3") int size
	      ) {
	    try {      
	      List<Cart> Carts = new ArrayList<Cart>();
	      Pageable paging = PageRequest.of(page, size);
	      
	      Page<Cart> pageTuts = cartRepository.findByIsPaid(true, paging);
	      Carts = pageTuts.getContent();
	            
	      Map<String, Object> response = new HashMap<>();
	      response.put("Carts", Carts);
	      response.put("currentPage", pageTuts.getNumber());
	      response.put("totalItems", pageTuts.getTotalElements());
	      response.put("totalPages", pageTuts.getTotalPages());
	      
	      return new ResponseEntity<>(response, HttpStatus.OK);
	    } catch (Exception e) {
	      return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	  }

}
