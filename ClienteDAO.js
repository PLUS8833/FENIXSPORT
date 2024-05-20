package com.fenixsport.dao;

import com.fenixsport.model.Cliente;
import com.fenixsport.util.DatabaseConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ClienteDAO {

    private static final String INSERT_CLIENTE_SQL = "INSERT INTO clientes (nombre, apellido, email, telefono) VALUES (?, ?, ?, ?)";
    private static final String SELECT_CLIENTE_BY_ID = "SELECT id, nombre, apellido, email, telefono FROM clientes WHERE id = ?";
    private static final String SELECT_ALL_CLIENTES = "SELECT * FROM clientes";
    private static final String DELETE_CLIENTE_SQL = "DELETE FROM clientes WHERE id = ?";
    private static final String UPDATE_CLIENTE_SQL = "UPDATE clientes SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id = ?";

    public void insertarCliente(Cliente cliente) throws SQLException {
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_CLIENTE_SQL)) {
            preparedStatement.setString(1, cliente.getNombre());
            preparedStatement.setString(2, cliente.getApellido());
            preparedStatement.setString(3, cliente.getEmail());
            preparedStatement.setString(4, cliente.getTelefono());
            preparedStatement.executeUpdate();
        } catch (SQLException e) {
            printSQLException(e);
        }
    }

    public Cliente seleccionarCliente(int id) throws SQLException {
        Cliente cliente = null;
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_CLIENTE_BY_ID)) {
            preparedStatement.setInt(1, id);
            ResultSet rs = preparedStatement.executeQuery();

            while (rs.next()) {
                String nombre = rs.getString("nombre");
                String apellido = rs.getString("apellido");
                String email = rs.getString("email");
                String telefono = rs.getString("telefono");
                cliente = new Cliente(id, nombre, apellido, email, telefono);
            }
        } catch (SQLException e) {
            printSQLException(e);
        }
        return cliente;
    }

    public List<Cliente> seleccionarTodosLosClientes() throws SQLException {
        List<Cliente> clientes = new ArrayList<>();
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_ALL_CLIENTES)) {
            ResultSet rs = preparedStatement.executeQuery();

            while (rs.next()) {
                int id = rs.getInt("id");
                String nombre = rs.getString("nombre");
                String apellido = rs.getString("apellido");
                String email = rs.getString("email");
                String telefono = rs.getString("telefono");
                clientes.add(new Cliente(id, nombre, apellido, email, telefono));
            }
        } catch (SQLException e) {
            printSQLException(e);
        }
        return clientes;
    }

    public boolean eliminarCliente(int id) throws SQLException {
        boolean rowDeleted;
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(DELETE_CLIENTE_SQL)) {
            statement.setInt(1, id);
            rowDeleted = statement.executeUpdate() > 0;
        }
        return rowDeleted;
    }

    public boolean actualizarCliente(Cliente cliente) throws SQLException {
        boolean rowUpdated;
        try (Connection connection = DatabaseConnection.getConnection();
             PreparedStatement statement = connection.prepareStatement(UPDATE_CLIENTE_SQL)) {
            statement.setString(1, cliente.getNombre());
            statement.setString(2, cliente.getApellido());
            statement.setString(3, cliente.getEmail());
            statement.setString(4, cliente.getTelefono());
            statement.setInt(5, cliente.getId());
            rowUpdated = statement.executeUpdate() > 0;
        }
        return rowUpdated;
    }

    private void printSQLException(SQLException ex) {
        for (Throwable e : ex) {
            if (e instanceof SQLException) {
                e.printStackTrace(System.err);
                System.err.println("SQLState: " + ((SQLException) e).getSQLState());
                System.err.println("Error Code: " + ((SQLException) e).getErrorCode());
                System.err.println("Message: " + e.getMessage());
                Throwable t = ex.getCause();
                while (t != null) {
                    System.out.println("Cause: " + t);
                    t = t.getCause();
                }
            }
        }
    }
}
