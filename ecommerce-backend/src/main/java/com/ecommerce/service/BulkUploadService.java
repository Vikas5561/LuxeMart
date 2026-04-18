package com.ecommerce.service;

import com.ecommerce.model.Product;
import com.ecommerce.repository.ProductRepository;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
public class BulkUploadService {

    @Autowired
    private ProductRepository productRepository;

    public int saveProductsFromCsv(MultipartFile file) throws IOException, CsvValidationException {
        List<Product> products = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
                CSVReader csvReader = new CSVReader(reader)) {

            String[] header = csvReader.readNext(); // Read header
            if (header == null)
                return 0;

            Map<String, Integer> colMap = getColumnMapping(header);

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                if (line.length < 2)
                    continue; // Skip empty rows

                try {
                    final String[] currentLine = line;
                    Product product = mapProductFromRow(colMap,
                            index -> (index < currentLine.length ? currentLine[index] : ""));
                    if (isValidProduct(product) && !productRepository.existsByProductName(product.getProductName())) {
                        products.add(product);
                    }
                } catch (Exception e) {
                    System.err.println("Skipping invalid CSV row: " + e.getMessage());
                }
            }
        }
        productRepository.saveAll(products);
        return products.size();
    }

    public int saveProductsFromExcel(MultipartFile file) throws IOException {
        List<Product> products = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row headerRow = sheet.getRow(0);
            if (headerRow == null)
                return 0;

            // Map headers from Excel Row
            String[] header = new String[headerRow.getLastCellNum()];
            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                header[i] = getCellValue(headerRow.getCell(i));
            }
            Map<String, Integer> colMap = getColumnMapping(header);

            for (Row row : sheet) {
                if (row.getRowNum() == 0)
                    continue; // Skip header

                // Check for empty row
                if (row.getCell(0) == null || getCellValue(row.getCell(0)).trim().isEmpty())
                    continue;

                try {
                    Product product = mapProductFromRow(colMap, index -> getCellValue(row.getCell(index)));
                    if (isValidProduct(product) && !productRepository.existsByProductName(product.getProductName())) {
                        products.add(product);
                    }
                } catch (Exception e) {
                    System.err.println("Skipping invalid Excel row: " + e.getMessage());
                }
            }
        }
        productRepository.saveAll(products);
        return products.size();
    }

    // Helper to map column names to indices
    private Map<String, Integer> getColumnMapping(String[] header) {
        Map<String, Integer> map = new HashMap<>();
        for (int i = 0; i < header.length; i++) {
            String col = header[i].toLowerCase().trim().replace(" ", "").replace("_", "");
            map.put(col, i);
        }
        return map;
    }

    // Functional interface to get value by index (abstracts CSV vs Excel)
    private interface ValueProvider {
        String getValue(int index);
    }

    private Product mapProductFromRow(Map<String, Integer> colMap, ValueProvider provider) {
        Product product = new Product();

        // Flexible Column Matching
        String name = getValue(colMap, provider, "productname", "name", "title");
        String category = getValue(colMap, provider, "category", "cat");
        String priceStr = getValue(colMap, provider, "price", "cost", "mrp");
        String qtyStr = getValue(colMap, provider, "quantity", "stock", "qty", "quantityavailable");
        String desc = getValue(colMap, provider, "description", "desc", "details");
        String img = getValue(colMap, provider, "imageurl", "image", "img", "url");

        product.setProductName(name);
        product.setCategory(category.isEmpty() ? "General" : category);
        product.setPrice(parseSafeDouble(priceStr));
        product.setQuantityAvailable(parseSafeInt(qtyStr));
        product.setDescription(desc);
        product.setImageUrl(img.isEmpty() ? "https://via.placeholder.com/150" : img);
        product.setStatus("Active");

        // Legacy fields
        product.setName(product.getProductName());
        product.setStock(product.getQuantityAvailable());

        return product;
    }

    private String getValue(Map<String, Integer> map, ValueProvider provider, String... keys) {
        for (String key : keys) {
            if (map.containsKey(key)) {
                return provider.getValue(map.get(key));
            }
        }
        return "";
    }

    private double parseSafeDouble(String val) {
        try {
            return Double.parseDouble(val.replaceAll("[^0-9.]", ""));
        } catch (Exception e) {
            return 0.0;
        }
    }

    private int parseSafeInt(String val) {
        try {
            return (int) Double.parseDouble(val.replaceAll("[^0-9.]", ""));
        } catch (Exception e) {
            return 0;
        }
    }

    private boolean isValidProduct(Product p) {
        return p.getProductName() != null && !p.getProductName().isEmpty() && p.getPrice() > 0;
    }

    private String getCellValue(Cell cell) {
        if (cell == null)
            return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }
}
