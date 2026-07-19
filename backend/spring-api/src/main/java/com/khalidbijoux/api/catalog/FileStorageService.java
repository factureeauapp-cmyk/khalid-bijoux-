package com.khalidbijoux.api.catalog;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@AllArgsConstructor
@Service
public class FileStorageService {

    private final Cloudinary cloudinary;
    private static final String UPLOAD_DIR = "uploads/products/";



    public String saveImage(MultipartFile file) {

        try {

            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap()
            );

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Erreur upload Cloudinary", e);
        }
    }


    public String saveImageold(MultipartFile file) {

        try {

            if (file == null || file.isEmpty()) {
                return "/images/default.png";
            }

            Files.createDirectories(Paths.get(UPLOAD_DIR));

            String extension = file.getOriginalFilename()
                    .substring(file.getOriginalFilename().lastIndexOf('.'));

            String filename = UUID.randomUUID() + extension;

            Path destination = Paths.get(UPLOAD_DIR, filename);

            Files.copy(
                    file.getInputStream(),
                    destination,
                    StandardCopyOption.REPLACE_EXISTING
            );

            return "/uploads/products/" + filename;

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'enregistrement de l'image", e);
        }
    }
}