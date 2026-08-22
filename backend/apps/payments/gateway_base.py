class BasePaymentGateway:
    """
    Common interface — swap mock with Razorpay/Cashfree by implementing this.
    """
    def initiate(self, order):
        raise NotImplementedError

    def verify(self, payment_data):
        raise NotImplementedError

    def refund(self, payment):
        raise NotImplementedError