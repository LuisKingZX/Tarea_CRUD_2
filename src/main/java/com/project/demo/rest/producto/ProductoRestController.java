package com.project.demo.rest.producto;

import com.project.demo.logic.entity.categoria.CategoriaRepository;
import com.project.demo.logic.entity.http.GlobalResponseHandler;
import com.project.demo.logic.entity.http.Meta;
import com.project.demo.logic.entity.producto.Producto;
import com.project.demo.logic.entity.producto.ProductoRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;


import java.util.Optional;

@RestController
@RequestMapping("/productos")
public class ProductoRestController {
    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;


    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getAllProductos(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            HttpServletRequest request) {

        Pageable pageable = PageRequest.of(page -1, size);
        Page<Producto> productosPage = productoRepository.findAll(pageable);

        Meta meta = new Meta(request.getMethod(),  request.getRequestURL().toString());
        meta.setTotalPages(productosPage.getTotalPages());
        meta.setTotalElements(productosPage.getTotalElements());
        meta.setPageNumber(productosPage.getNumber() + 1);
        meta.setPageSize(productosPage.getSize());

        return new GlobalResponseHandler().handleResponse("Productos encontrados", productosPage.getContent(), HttpStatus.OK, meta);
    }

    @PutMapping("/{productoId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<?> updateProducto(@PathVariable Long productoId, @RequestBody Producto producto, HttpServletRequest request) {
        Optional<Producto> foundProduct = productoRepository.findById(productoId);
        if (foundProduct.isPresent()) {
            if (producto.getCategoria() == null || producto.getCategoria().getId() == null || !categoriaRepository.existsById(producto.getCategoria().getId())) {
                return new GlobalResponseHandler().handleResponse("El id ingresado de la Categoría, no existe en la Base de Datos",
                        HttpStatus.BAD_REQUEST, request
                );
            }
            producto.setId(foundProduct.get().getId());
            productoRepository.save(producto);
            return new GlobalResponseHandler().handleResponse("Producto actualizado correctamente.",
                    producto, HttpStatus.OK, request
            );
        } else {
            return new GlobalResponseHandler().handleResponse("El producto con id: " + productoId + ", no existe",
                    HttpStatus.NOT_FOUND, request);
        }
    }

    @PatchMapping("/{productoId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<?> patchProducto(@PathVariable Long productoId, @RequestBody Producto producto, HttpServletRequest request) {
        Optional<Producto> foundProduct = productoRepository.findById(productoId);
        if (foundProduct.isPresent()) {
            if (producto.getNombre() != null) foundProduct.get().setNombre(producto.getNombre());
            if (producto.getDescripcion() != null) foundProduct.get().setDescripcion(producto.getDescripcion());
            if (producto.getPrecio() != null)  foundProduct.get().setPrecio(producto.getPrecio());

            if (producto.getCategoria() != null && producto.getCategoria().getId() != null) {
                if (categoriaRepository.existsById(producto.getCategoria().getId())) {
                    if (producto.getCategoria() != null) foundProduct.get().setCategoria(producto.getCategoria());
                } else {
                    return new GlobalResponseHandler().handleResponse(
                            "El id ingresado de la Categoría, no existe en la Base de Datos",
                            HttpStatus.BAD_REQUEST, request
                    );
                }
            }
            productoRepository.save(foundProduct.get());
            return new GlobalResponseHandler().handleResponse("Producto actualizado correctamente",
                    foundProduct.get(), HttpStatus.OK, request
            );
        } else {
            return new GlobalResponseHandler().handleResponse("El producto con el id: " + productoId + ", no fue encontrado",
                    HttpStatus.NOT_FOUND, request
            );
        }
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<?> createProduct(@RequestBody Producto producto, HttpServletRequest request) {
        if (producto.getCategoria() == null || producto.getCategoria().getId() == null || !categoriaRepository.existsById(producto.getCategoria().getId())) {
            return new GlobalResponseHandler().handleResponse("El id ingresado de la categoría, no existe en la Base de Datos",
                    HttpStatus.BAD_REQUEST, request
                    );
        }
        productoRepository.save(producto);
        return new GlobalResponseHandler().handleResponse("Producto guardado correctamente.",
                producto, HttpStatus.CREATED, request
        );
    }

    @DeleteMapping("/{productoId}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN')")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productoId, HttpServletRequest request) {
        Optional<Producto> foundProduct = productoRepository.findById(productoId);
        if (foundProduct.isPresent()) {
            productoRepository.deleteById(productoId);
            return new GlobalResponseHandler().handleResponse("Producto eliminado correctamente.",
                    foundProduct, HttpStatus.OK, request
            );
        } else {
            return new GlobalResponseHandler().handleResponse("El producto con id: " + productoId + ", no fue encontrado." ,
                    HttpStatus.NOT_FOUND, request);
        }
    }
}