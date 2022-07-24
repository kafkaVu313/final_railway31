package com.railway12.integrate.spring.react.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.railway12.integrate.spring.react.model.Cart;

public interface CartRepository extends JpaRepository<Cart, Long> {
	Page<Cart> findByIsPaid(boolean published, Pageable pageable);
	Page<Cart> findByTitleContaining(String title, Pageable pageable);
}
