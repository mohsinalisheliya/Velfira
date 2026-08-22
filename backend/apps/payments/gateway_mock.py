import uuid
from .gateway_base import BasePaymentGateway


class MockGateway(BasePaymentGateway):
    """
    Dev/test gateway — auto-succeeds every payment.
    Replace with RazorpayGateway or CashfreeGateway in production.
    """

    def initiate(self, order):
        return {
            "gateway": "mock",
            "gateway_txn_id": f"MOCK_{uuid.uuid4().hex[:12].upper()}",
            "amount": str(order.total),
            "status": "success",
        }

    def verify(self, payment_data):
        return True

    def refund(self, payment):
        return {"status": "refunded"}


def get_gateway():
    return MockGateway()