import { Button, Checkbox, Divider, Form, Input, Space, Typography, message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "@/api/client";
import { setSession } from "@/auth/session";
import "./login.css";

const { Text, Title } = Typography;

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGuest = () => {
    navigate("/");
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const data = await request("/api/auth/login", {
        method: "POST",
        json: { account: values.account, password: values.password },
      });
      setSession({ token: data.token, user: data.user });
      message.success("登录成功");
      navigate(data.user?.role === "owner" ? "/" : "/");
    } catch (e) {
      message.error(e instanceof Error ? e.message : "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-hero">
        <div className="login-brand">
          <span className="login-brand__logo">鑫</span>
          <span className="login-brand__name">鑫哥的博客</span>
        </div>

        <div className="login-hero__content">
          <Text className="login-hero__eyebrow">Welcome</Text>
          <Title className="login-hero__title">读者随便逛，博主登录后管理内容</Title>
          <Text className="login-hero__desc">
            游客无需登录即可阅读文章与发表评论；博主账号用于发布文章、查看并回复读者留言。
          </Text>
        </div>

        <div className="login-hero__stats">
          <div>
            <strong>公开</strong>
            <span>阅读</span>
          </div>
          <div>
            <strong>评论</strong>
            <span>互动</span>
          </div>
          <div>
            <strong>博主</strong>
            <span>写作</span>
          </div>
        </div>
      </section>

      <section className="login-card" aria-label="登录表单">
        <Space direction="vertical" size={6} className="login-card__header">
          <Title level={2}>博主登录</Title>
          <Text type="secondary">仅博主需要登录；读者请点击下方「游客进入」。</Text>
        </Space>

        <Button block size="large" onClick={handleGuest} style={{ marginBottom: 16 }}>
          游客进入（不登录）
        </Button>

        <Form layout="vertical" size="large" className="login-form" onFinish={handleLogin}>
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: "请输入账号" }]}
          >
            <Input placeholder="博主账号" autoComplete="username" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password placeholder="密码" autoComplete="current-password" />
          </Form.Item>

          <div className="login-form__extras">
            <Checkbox>记住我</Checkbox>
            <a href="#forgot-password">忘记密码？</a>
          </div>

          <Button type="primary" htmlType="submit" block className="login-form__submit" loading={loading}>
            登录
          </Button>
        </Form>

        <Divider plain>提示</Divider>

        <Text className="login-card__footer">读者发表评论不需要账号。</Text>
      </section>
    </main>
  );
};