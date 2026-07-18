package com.khalidbijoux.api.catalog;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
@Service
public class FileStorageService {

    private static final String UPLOAD_DIR = "uploads/products/";

    public String saveImage(MultipartFile file) {

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