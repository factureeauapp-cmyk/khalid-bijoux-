package com.khalidbijoux.api.catalog;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateProductRequest {

    private String id;
    private String nameFr;
    private String nameAr;
    private String descriptionFr;
    private String descriptionAr;
    private String categoryId;
    private Integer price;
    private Integer originalPrice;
    private String tag;
    private String existingImage;

    private MultipartFile image;
}