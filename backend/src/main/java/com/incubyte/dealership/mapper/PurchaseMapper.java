package com.incubyte.dealership.mapper;

import com.incubyte.dealership.dto.PurchaseResponse;
import com.incubyte.dealership.model.Purchase;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper utility to convert Purchase entities to DTO responses.
 */
public class PurchaseMapper {

    public static PurchaseResponse toResponse(Purchase purchase) {
        if (purchase == null) {
            return null;
        }
        return PurchaseResponse.builder()
                .id(purchase.getId())
                .make(purchase.getMake())
                .model(purchase.getModel())
                .category(purchase.getCategory())
                .price(purchase.getPrice())
                .quantity(purchase.getQuantity())
                .purchaseDate(purchase.getPurchaseDate())
                .build();
    }

    public static List<PurchaseResponse> toResponseList(List<Purchase> purchases) {
        if (purchases == null) {
            return null;
        }
        return purchases.stream()
                .map(PurchaseMapper::toResponse)
                .collect(Collectors.toList());
    }
}
