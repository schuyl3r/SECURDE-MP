import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button, Alert, message, Input, Card, Row } from 'antd';
import 'antd/dist/antd.css';

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
class Page extends Component {
  state = {
    defaultValue: ""
  }

  onSubmit = values => {
    const reqOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        user_id: this.props.user.user_id, 
        new_password: values.new_password,
      })
    }
    fetch("http://localhost:8000/user/change_password", reqOptions)
      .then(res => res.json())
      .then(res => {
        if(res.status === "ERROR")
          message.error(res.payload)
        else{
          message.success("Successfuly changed password")
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render() {
    const { user } = this.props
    return (
      <div>
        <h1>Change Password Page</h1>
        <Row justify="center">
          <Form {...formItemLayout} name="changePassword" onFinish={this.onSubmit} initialValues={{old: "", new_password: "", confirm: ""}} scrollToFirstError>
            <Card style={{width: "600px", marginTop: 100}}>
              <Form.Item
                name="old"
                label="Old Password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your old password!',
                  },
                  () => ({
                    validator(rule, value) {
                      if (!value || user.password === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject('Invalid Password!');
                    },
                  }),
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
              
              <Form.Item
                name="new_password"
                label="New Password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your new password!',
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirm New Password"
                dependencies={['password']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: 'Please confirm your new password!',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject('Passwords do not match!');
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Row justify="center">
                <Form.Item>
                  <Button style={{marginTop: 20}} type="primary" htmlType="submit">Update</Button>
                </Form.Item>
              </Row>
            </Card>
          </Form>
        </Row>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({})

const mapStateToProps = state => ({
  user: state.simpleReducer.user,
  userType: state.simpleReducer.userType,
})

export default connect(mapStateToProps, mapDispatchToProps)(Page);