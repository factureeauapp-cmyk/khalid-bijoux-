package com.khalidbijoux.api.catalog;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;



@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;
    private static final int MAX_FILES = 10;

    private final Path uploadDirectory;
    private final Cloudinary cloudinary;

    public FileStorageService(
            @Value("${app.upload.directory:uploads/products}")
            String uploadDirectory,
            Cloudinary cloudinary) {

        this.uploadDirectory = Paths.get(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        this.cloudinary = cloudinary;
    }

    public List<String> saveImages(List<MultipartFile> files) {
        return files.stream()
                .map(this::saveImage)
                .toList();
    }

    public String saveImage(MultipartFile file) {

        try {

            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.emptyMap()
            );

            System.out.println("CLOUDINARY URL = "
                    + uploadResult.get("secure_url"));

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new RuntimeException("Erreur upload Cloudinary", e);
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("An image file is required");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Each image must be 5 MB or smaller");
        }
        String contentType = file.getContentType();
        if (contentType == null || !List.of("image/jpeg", "image/png", "image/webp").contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new IllegalArgumentException("Only JPG, JPEG, PNG and WEBP images are allowed");
        }
        extensionOf(file.getOriginalFilename());
    }

    private String extensionOf(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new IllegalArgumentException("Image filename must have an extension");
        }
        String extension = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase(Locale.ROOT);
        if (!List.of(".jpg", ".jpeg", ".png", ".webp").contains(extension)) {
            throw new IllegalArgumentException("Only JPG, JPEG, PNG and WEBP images are allowed");
        }
        return extension;
    }
}
