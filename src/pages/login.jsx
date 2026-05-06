import { Button, Checkbox, Divider, Form, Input, Space, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import "./login.css";

const { Text, Title } = Typography;

export const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="login-brand">
          <span className="login-brand__logo">鑫</span>
          <span className="login-brand__name">鑫哥的博客</span>
        </div>

        <div className="login-hero__content">
          <Text className="login-hero__eyebrow">Welcome Back</Text>
          <Title className="login-hero__title">登录后继续记录你的技术灵感</Title>
          <Text className="login-hero__desc">
            在鑫哥的博客里整理 React、前端工程化和生活随笔，把每一次成长都沉淀下来。
          </Text>
        </div>

        <div className="login-hero__stats">
          <div>
            <strong>128+</strong>
            <span>篇文章</span>
          </div>
          <div>
            <strong>36</strong>
            <span>个专题</span>
          </div>
          <div>
            <strong>7k+</strong>
            <span>次阅读</span>
          </div>
        </div>
      </section>

      <section className="login-card" aria-label="登录表单">
        <Space direction="vertical" size={6} className="login-card__header">
          <Title level={2}>欢迎回来</Title>
          <Text type="secondary">登录鑫哥的博客，管理你的文章和灵感。</Text>
        </Space>

        <Form layout="vertical" size="large" className="login-form" onFinish={handleLogin}>
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input placeholder="请输入用户名或邮箱" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="请输入密码" autoComplete="current-password" />
          </Form.Item>

          <div className="login-form__extras">
            <Checkbox>记住我</Checkbox>
            <a href="#forgot-password">忘记密码？</a>
          </div>

          <Button type="primary" htmlType="submit" block className="login-form__submit">
            登录博客
          </Button>
        </Form>

        <Divider plain>或</Divider>

        <Text className="login-card__footer">
          还没有账号？<a href="#register">立即加入鑫哥的博客</a>
        </Text>
      </section>
    </main>
  );
};
