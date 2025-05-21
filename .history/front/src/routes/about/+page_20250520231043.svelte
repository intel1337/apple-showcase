<svelte:head>
	<title>Apple</title>
	<meta name="description" content="About this shop" />
</svelte:head>

<section class="about-container">
	<div class="about-card">
		<h1>About Us</h1>
		<p>At Apple, we believe in the power of innovation to enrich lives.</p>
		<p>Since 1976, we've been redefining technology through design, usability, and seamless integration. From the first Macintosh to the iPhone, from the App Store to Apple Silicon, we've always aimed to build products that are not only powerful but also intuitive and personal.</p>
		<p>We design hardware, software, and services with a singular goal: to create experiences that just work—beautifully. Every device, every product ecosystem, and every line of code is made with care and attention to detail, so you can focus on what matters most.</p>
		<p><strong>Privacy. Accessibility. Sustainability.</strong> These aren't features—they're values. And they're built into everything we do.</p>
		<p>Apple is more than a company. It's a community of thinkers, creators, and doers—empowering people around the world to dream bigger, create freely, and connect effortlessly.</p>
		<p class="welcome">Welcome to Apple.</p>
	</div>
</section>

<style>
.about-container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 80vh;
	padding: 2rem 1rem;
	background: linear-gradient(120deg, #f5f6fa 0%, #e9ecef 100%);
}

.about-card {
	background: #fff;
	border-radius: 24px;
	box-shadow: 0 8px 32px 0 rgba(60,60,60,0.08);
	max-width: 600px;
	padding: 2.5rem 2rem;
	margin: 0 auto;
	text-align: center;
}

.about-card h1 {
	font-size: 2.5rem;
	font-weight: 700;
	margin-bottom: 1.5rem;
	color: #111;
	letter-spacing: -1px;
}

.about-card p {
	font-size: 1.15rem;
	line-height: 1.7;
	color: #444;
	margin-bottom: 1.1rem;
}

.about-card .welcome {
	font-size: 1.3rem;
	font-weight: 600;
	color: #0071e3;
	margin-top: 2rem;
}

@media (max-width: 700px) {
	.about-card {
		padding: 1.2rem 0.7rem;
	}
	.about-card h1 {
		font-size: 2rem;
	}
}
</style>