import React, { useEffect, useState } from 'react';
import { getCategories } from '../../api/CategoriesAPI';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Alert, Table, Container, Button } from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        setError(error.message || 'Lỗi khi tải danh sách danh mục');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Danh sách danh mục</h2>
        <Button variant="primary">Thêm danh mục</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên danh mục</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category._id}>
              <td>{index + 1}</td>
              <td>{category.categoryName}</td>
              <td>
                <Link to={`/categories/${category._id}`}>
                    <Button variant="warning" size="sm" className="me-2">
                        <FaEdit /> Sửa
                    </Button>
                </Link>
                <Button variant="danger" size="sm">
                  <FaTrash /> Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {categories.length === 0 && (
        <Alert variant="info">Không có danh mục nào</Alert>
      )}
    </Container>
  );
};

export default CategoryList;