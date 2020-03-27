import React, { Component } from 'react';
import "antd/dist/antd.css";
import { Form, Row, Input, Table, Button, Modal, message} from "antd";
import { PlusOutlined } from '@ant-design/icons';

class Page extends Component {
  state = {
    selectedAuthor: {},
    authors: [],
    modalVisible: false,
    columns: [
      {
        title: 'Author ID',
        dataIndex: 'author_id',
        key: 'author_id',
      },
      {
        title: 'First Name',
        dataIndex: 'first_name',
        key: 'first_name',
      },
      {
        title: 'Last Name',
        dataIndex: 'last_name',
        key: 'last_name',
      },
      {
        title: 'Actions',
        key: 'action',
        render: (text, record) => {
          return(
            <span>
              <a style={{ marginRight: 16 }} 
                onClick={() => this.setState({selectedAuthor: record, modalVisible: true})}>Edit</a>
              <a>Delete</a>
            </span>
          )
        },
      },
    ],
  }

  componentDidMount(){
    this.getAllAuthors()
  }

  componentDidUpdate(){
    this.getAllAuthors()
  }

  getAllAuthors(){
    fetch("http://localhost:8000/author/")
      .then(res => res.json())
      .then(res => {
        if(res.status !== "ERROR"){
          let authors = res.payload.map(author => {
            return ({
                key: author.author_id,
                author_id: author.author_id,
                first_name: author.first_name,
                last_name: author.last_name,
            })
          })
          this.setState({authors})
        }
      })
  }

  handleAddAuthor = values => {
    const reqOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ first_name: values.firstname, last_name: values.lastname})
    }
    fetch("http://localhost:8000/author/add_author", reqOptions)
      .then(res => res.json())
      .then(res => {
        if(res.status === "ERROR")
          console.log("Cause of Error: ", res.payload);
        else
          message.success("Author Successfully Added!")
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleUpdateAuthor = values => {
    const reqOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ first_name: values.firstname, last_name: values.lastname})
    }
    fetch("http://localhost:8000/author/edit_author", reqOptions)
      .then(res => res.json())
      .then(res => {
        if(res.status === "ERROR")
          console.log("Cause of Error: ", res.payload);
        else{
          message.success("Author Successfully Updated!")
          this.toggleModal(false)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  toggleModal = modalVisible => {
    this.setState({modalVisible})
  }

  render() {
    const {selectedAuthor} = this.state
    return (
      <div>
        <h1 style={{marginBottom: 50}}>Authors Page</h1>
        <Form layout="inline" hideRequiredMark onFinish={this.handleAddAuthor}>
          <Row style={{width: "100%"}} justify="center">
            <Form.Item
              name="firstname"
              label="First Name"
              rules={[{ required: true, message: 'Please input author first name!'},]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="lastname"
              label="Last Name"
              rules={[{ required: true, message: 'Please input author last name!'},]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                <PlusOutlined /> Add author
              </Button>
            </Form.Item>
          </Row>
        </Form>
        <Table style={{marginTop: 50}} columns={this.state.columns} dataSource={this.state.authors}/>
        <Modal
          title="Edit Author"
          visible={this.state.modalVisible}
          footer={null}
          onCancel={() => this.toggleModal(false)}
          destroyOnClose
        >
          <Form layout="inline" hideRequiredMark onFinish={this.handleUpdateAuthor}
            initialValues={{firstname: selectedAuthor.first_name, lastname: selectedAuthor.last_name}}>
            <Row style={{width: "100%"}} justify="center">
              <Form.Item
                name="firstname"
                label="First Name"
                rules={[{ required: true, message: 'Please input author first name!'},]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="lastname"
                label="Last Name"
                rules={[{ required: true, message: 'Please input author last name!'},]}
              >
                <Input />
              </Form.Item>
            </Row>
            <Row style={{width: "100%", marginTop: 20}} justify="end">
              <Button onClick={() => this.toggleModal(false)} style={{ marginRight: 8 }}>Cancel</Button>
              <Button type="primary" htmlType="submit">Save</Button>
            </Row>      
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Page;