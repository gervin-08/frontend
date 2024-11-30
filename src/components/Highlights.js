import { Row, Col, Card } from 'react-bootstrap';

export default function Highlights() {
	
	return (
		<>
		<Row className="mt-5 pb-5">
		<h1 className='text-center mb-5'>Check out our featured products</h1>
		    <Col xs={12} md={4}>
		        <Card className="cardHighlight p-3">
		            <Card.Body>
		                <Card.Title>
		                    <h2>Product 1</h2>
		                </Card.Title>
		                <Card.Text>
						Ex Lorem cillum consequat ad. Consectetur enim sunt amet sit nulla dolor exercitation est pariatur aliquip minim. Commodo velit est in id anim deserunt ullamco sint aute amet. Adipisicing est Lorem aliquip anim occaecat consequat in magna nisi occaecat consequat et. Reprehenderit elit dolore sunt labore qui.
		                </Card.Text>
		            </Card.Body>
		        </Card>
		    </Col>
		    <Col xs={12} md={4}>
		        <Card className="cardHighlight p-3">
		            <Card.Body>
		                <Card.Title>
		                    <h2>Product 2</h2>
		                </Card.Title>
		                <Card.Text>
		                    Ex Lorem cillum consequat ad. Consectetur enim sunt amet sit nulla dolor exercitation est pariatur aliquip minim. Commodo velit est in id anim deserunt ullamco sint aute amet. Adipisicing est Lorem aliquip anim occaecat consequat in magna nisi occaecat consequat et. Reprehenderit elit dolore sunt labore qui.
		                </Card.Text>
		            </Card.Body>
		        </Card>
		    </Col>
		    <Col xs={12} md={4}>
		        <Card className="cardHighlight p-3">
		            <Card.Body>
		                <Card.Title>
		                    <h2>Product 3</h2>
		                </Card.Title>
		                <Card.Text>
		                    Minim nostrud dolore consequat ullamco minim aliqua tempor velit amet. Officia occaecat non cillum sit incididunt id pariatur. Mollit tempor laboris commodo anim mollit magna ea reprehenderit fugiat et reprehenderit tempor. Qui ea Lorem dolor in ad nisi anim. Culpa adipisicing enim et officia exercitation adipisicing.
		                </Card.Text>
		            </Card.Body>
		        </Card>
		    </Col>
		</Row>

		</>
	)	
}