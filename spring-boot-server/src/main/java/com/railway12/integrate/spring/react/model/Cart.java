package com.railway12.integrate.spring.react.model;

import javax.persistence.*;

@Entity
@Table(name = "carts")
public class Cart{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "title")
	private String title;

	@Column(name = "description")
	private String description;

	@Column(name = "is_paid")
	private boolean isPaid;
	
	@Column(name = "amount")
	private double amount;
	
	@Column(name = "img_url")
	private String imgUrl;
	

	public Cart() {

	}

	

	public Cart(String title, String description, boolean isPaid, double amount, String imgUrl) {
		super();
		this.title = title;
		this.description = description;
		this.isPaid = isPaid;
		this.amount = amount;
		this.imgUrl = imgUrl;
		
	}



	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean getIsPaid() {
		return isPaid;
	}

	public void setIsPaid(boolean isPaid) {
		this.isPaid = isPaid;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public String getImgUrl() {
		return imgUrl;
	}

	public void setImgUrl(String imgUrl) {
		this.imgUrl = imgUrl;
	}

	

}
