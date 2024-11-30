import Banner from '../components/Banner';
import Highlights from '../components/Highlights';

export default function Home() {

	const data = {
		title: "ShopLifting Online Store",
		content: "Welcome to our online shopping paradise! Discover a world of convenience and style right at your fingertips.",
		destination: "/products",
		label: "Shop Now!"
	}

	return (
		<>
			<Banner data={data} />
			<Highlights />
		</>
	)
}