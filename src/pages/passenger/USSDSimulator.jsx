import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ussdAPI } from '../../services/api';
import { Smartphone, Send, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const USSDSimulator = () => {
  const [sessionId] = useState(
    Math.random().toString(36).substr(2, 9)
  );

  const [input, setInput] = useState('');

  const [messages, setMessages] = useState([]);

  const [currentMenu, setCurrentMenu] = useState('');

  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    setMessages([]);

    setCurrentMenu('main');

    setMessages([
      {
        type: 'system',
        text:
          'Welcome to Movia Transport\n' +
          '1. Book Ticket\n' +
          '2. View My Tickets\n' +
          '3. Check Schedule\n' +
          '4. Account Balance\n' +
          '0. Exit',
      },
    ]);
  };

  const processInput = async (value) => {
    setMessages((prev) => [
      ...prev,
      { type: 'user', text: value },
    ]);

    setLoading(true);

    try {
      let response = '';

      if (currentMenu === 'main') {
        switch (value) {
          case '1':
            setCurrentMenu('book');

            response =
              'Book Ticket\n' +
              'Enter route:\n' +
              '1. Kigali-Musanze\n' +
              '2. Kigali-Huye\n' +
              '0. Back';

            break;

          case '2':
            setCurrentMenu('tickets');

            response =
              'Your Tickets:\n' +
              '1. RAB 123A - Kigali to Musanze\n' +
              '   Date: Today 8:00 AM\n' +
              '   Seat: 1\n' +
              '0. Back';

            break;

          case '3':
            setCurrentMenu('schedule');

            response =
              "Today's Schedule:\n" +
              '08:00 AM - Kigali to Musanze\n' +
              '09:30 AM - Kigali to Huye\n' +
              '0. Back';

            break;

          case '4':
            setCurrentMenu('balance');

            response =
              'Account Balance: RWF 5,000\n' +
              '1. Top Up\n' +
              '0. Back';

            break;

          case '0':
            response =
              'Thank you for using Movia Transport!';

            setCurrentMenu('');

            break;

          default:
            response =
              'Invalid option. Please try again.';
        }
      } else if (currentMenu === 'book') {
        if (value === '0') {
          setCurrentMenu('main');

          response =
            'Welcome to Movia Transport\n' +
            '1. Book Ticket\n' +
            '2. View My Tickets\n' +
            '3. Check Schedule\n' +
            '4. Account Balance\n' +
            '0. Exit';
        } else if (
          ['1', '2'].includes(value)
        ) {
          setCurrentMenu('booking_date');

          response =
            'Select Date:\n' +
            '1. Today\n' +
            '2. Tomorrow\n' +
            '3. Day After\n' +
            '0. Back';
        }
      } else if (currentMenu === 'booking_date') {
        if (value === '0') {
          setCurrentMenu('book');

          response =
            'Book Ticket\n' +
            'Enter route:\n' +
            '1. Kigali-Musanze\n' +
            '2. Kigali-Huye\n' +
            '0. Back';
        } else if (
          ['1', '2', '3'].includes(value)
        ) {
          setCurrentMenu('booking_confirm');

          response =
            'Booking Summary:\n' +
            'Route: Kigali-Musanze\n' +
            'Date: Today\n' +
            'Price: RWF 3,000\n' +
            '1. Confirm\n' +
            '0. Cancel';
        }
      } else if (
        currentMenu === 'booking_confirm'
      ) {
        if (value === '1') {
          response =
            'SUCCESS!\n' +
            'Booking confirmed\n' +
            'Ticket ID: TKT-' +
            Math.random()
              .toString(36)
              .substr(2, 6)
              .toUpperCase() +
            '\nAmount: RWF 3,000\n' +
            'Thank you!';

          setCurrentMenu('');
        } else {
          setCurrentMenu('main');

          response =
            'Booking cancelled.\n\n' +
            'Welcome to Movia Transport\n' +
            '1. Book Ticket\n' +
            '2. View My Tickets\n' +
            '3. Check Schedule\n' +
            '4. Account Balance\n' +
            '0. Exit';
        }
      } else if (value === '0') {
        setCurrentMenu('main');

        response =
          'Welcome to Movia Transport\n' +
          '1. Book Ticket\n' +
          '2. View My Tickets\n' +
          '3. Check Schedule\n' +
          '4. Account Balance\n' +
          '0. Exit';
      }

      setMessages((prev) => [
        ...prev,
        { type: 'system', text: response },
      ]);
    } catch (error) {
      console.error('USSD error:', error);

      toast.error('USSD service error');
    } finally {
      setLoading(false);

      setInput('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (input.trim()) {
      processInput(input.trim());
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          USSD Simulator
        </h1>

        <p className="text-muted-foreground">
          Test the feature phone booking interface
        </p>
      </div>

      <Card className="border-2">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Smartphone className="w-6 h-6 text-primary-foreground" />
            </div>

            <div>
              <CardTitle>
                Feature Phone Interface
              </CardTitle>

              <CardDescription>
                Dial *123# to start
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-muted rounded-2xl flex items-center justify-center">
                <Smartphone className="w-12 h-12 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold mb-2">
                Start USSD Session
              </h3>

              <p className="text-muted-foreground mb-4">
                Click the button below to simulate
                dialing *123#
              </p>

              <Button
                onClick={startSession}
                size="lg"
              >
                Dial *123#
              </Button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.type === 'system'
                        ? 'bg-background border border-border'
                        : 'bg-primary text-primary-foreground ml-auto max-w-fit'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {msg.text}
                    </pre>
                  </div>
                ))}

                {loading && (
                  <div className="bg-background border border-border p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Processing...
                    </p>
                  </div>
                )}
              </div>

              {/* Input */}
              {currentMenu && (
                <form
                  onSubmit={handleSubmit}
                  className="flex gap-2"
                >
                  <Input
                    value={input}
                    onChange={(e) =>
                      setInput(e.target.value)
                    }
                    placeholder="Enter option number..."
                    className="font-mono text-lg"
                    autoFocus
                    disabled={loading}
                  />

                  <Button
                    type="submit"
                    disabled={
                      loading || !input.trim()
                    }
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setMessages([]);
                    setCurrentMenu('');
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  End Session
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={startSession}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Restart
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            About USSD Service
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3 p-3 bg-accent/50 rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold">
                1
              </span>
            </div>

            <div>
              <p className="font-medium mb-1">
                Dial *123#
              </p>

              <p className="text-muted-foreground">
                Access Movia services from any
                phone
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-accent/50 rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold">
                2
              </span>
            </div>

            <div>
              <p className="font-medium mb-1">
                No Internet Required
              </p>

              <p className="text-muted-foreground">
                Works on all mobile networks
              </p>
            </div>
          </div>

          <div className="flex gap-3 p-3 bg-accent/50 rounded-lg">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold">
                3
              </span>
            </div>

            <div>
              <p className="font-medium mb-1">
                Book, Pay, Travel
              </p>

              <p className="text-muted-foreground">
                Complete booking process via USSD
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default USSDSimulator;