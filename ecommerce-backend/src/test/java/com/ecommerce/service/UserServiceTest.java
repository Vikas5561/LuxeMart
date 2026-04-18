package com.ecommerce.service;

import com.ecommerce.model.Address;
import com.ecommerce.model.User;
import com.ecommerce.repository.AddressRepository;
import com.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AddressRepository addressRepository;

    @InjectMocks
    private UserService userService;

    private User user;
    private Address address;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setUserId(1L);
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john@example.com");

        address = new Address();
        address.setAddressId(1L);
        address.setCity("New York");
        address.setUser(user);
    }

    @Test
    void testGetUserById_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User foundUser = userService.getUserById(1L);

        assertNotNull(foundUser);
        assertEquals("John", foundUser.getFirstName());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.getUserById(99L));
        verify(userRepository, times(1)).findById(99L);
    }

    @Test
    void testUpdateUser_Success() {
        User userDetails = new User();
        userDetails.setFirstName("Jane");
        userDetails.setLastName("Smith");
        userDetails.setPhone("1234567890");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User updatedUser = userService.updateUser(1L, userDetails);

        assertEquals("Jane", updatedUser.getFirstName());
        assertEquals("Smith", updatedUser.getLastName());
        assertEquals("1234567890", updatedUser.getPhone());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void testAddAddress_FirstAddressIsDefault() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(addressRepository.findByUserUserId(1L)).thenReturn(new ArrayList<>()); // No existing addresses
        // Fix: Return the argument to capture the modified state
        when(addressRepository.save(any(Address.class))).thenAnswer(i -> i.getArguments()[0]);

        Address newAddress = new Address();
        newAddress.setCity("Boston");

        Address savedAddress = userService.addAddress(1L, newAddress);

        assertTrue(savedAddress.isDefault()); // Should be set to default
        verify(addressRepository, times(1)).save(newAddress);
    }
}
