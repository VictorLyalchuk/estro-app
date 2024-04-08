const DeliveryAndPayment = () => {
    return (
        <div className="bg-gray-100" style={{ minHeight: '900px' }}>
            <div className="text-gray-700 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl font-bold mb-4  text-center">Delivery and Payment</h2>
                <p className="text-lg mb-6">Thank you for choosing Estro.</p>

                <p className="text-lg mb-6">
                    Goods delivery across Ukraine is carried out by the carrier Nova Poshta. You can choose delivery to the branch, to the post machine, or by courier to the address.
                </p>

                <p className="text-lg mb-6">
                    All orders containing more than one item are packaged separately for your convenience and formed into several shipments.
                </p>

                <p className="text-lg mb-6">
                    Payment for orders is currently made in two ways:
                </p>

                <ul className="list-disc list-inside text-lg mb-6">
                    <li>Through the online payment system LiqPay on the website.</li>
                    <li>Cash on delivery upon receipt of goods at the Nova Poshta branch.</li>
                </ul>

                <p className="text-lg mb-6">
                    Goods with a value of over 1000 UAH, paid online, are delivered free of charge. If you refused the goods upon inspection, the payment will be refunded to the payer's card. The term for crediting returned funds to the card account is determined by the issuing bank.
                </p>

                <p className="text-lg mb-6">
                    When paying by cash on delivery, an additional commission of 20 UAH and 2% of the order amount are charged from the buyer. The cost of delivery is determined by Nova Poshta according to their tariffs. If the product does not suit you for any reason, you can refuse it at the Nova Poshta branch or return the goods to the courier without paying for it.
                </p>

                <p className="text-lg mb-6">
                    You can familiarize yourself with the delivery times to your region on the Nova Poshta website.
                </p>

                <p className="text-lg mb-6">
                    We want to draw your attention to the fact that online payment is mandatory in the following cases:
                </p>

                <ol className="list-decimal list-inside text-lg mb-6">
                    <li>The cost of the product does not exceed 1000 UAH.</li>
                    <li>The order contains more than two positions.</li>
                    <li>The number of refusals of parcels exceeds the number of payments.</li>
                </ol>

                <p className="text-lg mb-6">
                    You can familiarize yourself with the return conditions in the "Return or Exchange of New Goods" section.
                </p>

                <p className="text-lg mb-6">
                    Also, for any questions regarding orders, you can contact customer support at the following phone numbers:
                </p>

                <ul className="list-disc list-inside text-lg mb-6">
                    <li>+38 (099) 167 99 99</li>
                    <li>+38 (098) 167 99 99</li>
                    <li>+38 (073) 167 99 99</li>
                </ul>

                <p className="text-lg mb-6">
                    We work: Monday - Saturday, from 9:00 to 18:00.
                </p>

                <p className="text-lg mb-6">
                    Estro cares to make your online shopping convenient and comfortable!
                </p>

                <img src="http://localhost:5173/public/images/payment.webp" alt="Payment methods" />
            </div>
        </div>
    );
};

export default DeliveryAndPayment;
