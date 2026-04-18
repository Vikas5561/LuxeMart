package com.ecommerce.service;

import com.ecommerce.model.Offer;
import com.ecommerce.repository.OfferRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class OfferService {

    @Autowired
    private OfferRepository offerRepository;

    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }

    public List<Offer> getActiveOffers() {
        return offerRepository.findByStatus("Active");
    }

    public Offer createOffer(Offer offer) {
        offer.setCreatedAt(LocalDateTime.now());
        if (offer.getStatus() == null) {
            offer.setStatus("Active");
        }
        return offerRepository.save(offer);
    }

    public void deleteOffer(Long id) {
        offerRepository.deleteById(id);
    }

    public Offer updateStatus(Long id, String status) {
        Offer offer = offerRepository.findById(id).orElseThrow(() -> new RuntimeException("Offer not found"));
        offer.setStatus(status);
        return offerRepository.save(offer);
    }
}
