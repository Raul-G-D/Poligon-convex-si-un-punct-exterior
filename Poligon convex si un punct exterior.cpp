#include <iostream>
#include <cmath>
#include <algorithm>
#include <vector>

using namespace std;

double getClockwiseAngle(pair<int, int> p) {
	double angle = 0.0;

	angle = -1 * atan2(p.first, -1 * p.second);
	return angle;
}

bool comparePoints(pair<int, int> p1, pair<int, int> p2) {
	return getClockwiseAngle(p1) > getClockwiseAngle(p2);
}

int orientation(pair<int, int> a, pair<int, int> b, pair<int, int> c)
{
	int res = (b.second - a.second) * (c.first - b.first) - (c.second - b.second) * (b.first - a.first);

	if (res == 0)
		return 0; //coliniare
	if (res > 0)
		return 1; // spre dreapta
	return -1; // spre stanga trigonometric
}

// Returnează pătratul distanței dintre două puncte de intrare
int sqDist(pair<int, int> p1, pair<int, int> p2)
{
	return (p1.first - p2.first) * (p1.first - p2.first) +
		(p1.second - p2.second) * (p1.second - p2.second);
}

// Verifică dacă punctul este în interiorul multimii convexe sau nu
bool inside(vector<pair<int, int>> a, pair<int, int> p)
{
	// centroidul multimii convexe
	pair<int, int> mid = { 0, 0 };

	int n = a.size();
	
	// evitare floating point arithmetic. 
	p.first *= n;
	p.second *= n;

	for (int i = 0; i < n; i++)
	{
		mid.first += a[i].first;
		mid.second += a[i].second;
		a[i].first *= n;
		a[i].second *= n;
	}

	//verificam daca punctul dat si centroidul multimii convexe sunt de aceeasi parte a tuturor dreptelor din multime. 
	for (int i = 0, j; i < n; i++)
	{
		j = (i + 1) % n;
		int x1 = a[i].first, x2 = a[j].first;
		int y1 = a[i].second, y2 = a[j].second;

		int a1 = y1 - y2;
		int b1 = x2 - x1;

		int c1 = x1 * y2 - y1 * x2;

		int for_mid = a1 * mid.first + b1 * mid.second + c1;
		int for_p = a1 * p.first + b1 * p.second + c1;

		if (for_mid * for_p < 0)
			return false;
	}

	return true;
}


void addPoint(vector<pair<int, int>>& a, pair<int, int> p)
{
	
	if (inside(a, p)) 
	{
		return;
	}

	// gasim punctul din multimea convexa cu distanta minima fata de punctul dat
	int ind = 0;
	int n = a.size();
	for (int i = 1; i < n; i++)
		if (sqDist(p, a[i]) < sqDist(p, a[ind]))
			ind = i;

	// tangenta de sus
	int up = ind;
	while (orientation(p, a[up], a[(up + 1) % n]) >= 0)
		up = (up + 1) % n;

	// tangenta de jos
	int low = ind;
	while (orientation(p, a[low], a[(n + low - 1) % n]) <= 0)
		low = (n + low - 1) % n;

	// rezultat 
	vector<pair<int, int>>ret;

	// noua multime convexa traversand de la punctul de sus pana la cel de jos
	int curr = up;
	ret.push_back(a[curr]);
	while (curr != low)
	{
		curr = (curr + 1) % n;
		ret.push_back(a[curr]);
	}

	ret.push_back(p);
	a.clear();
	for (int i = 0; i < ret.size(); i++)
		a.push_back(ret[i]);
}


int main()
{
	
	vector<pair<int, int> > a;

	a.push_back({ 0, 0 });
	a.push_back({ 2, 0 });
	a.push_back({ 2, 2 });
	a.push_back({ 0, 2 });

	int n = a.size();

	

	pair<int, int> p = { 3, 3 };

	sort(a.begin(), a.end(), comparePoints);

	addPoint(a, p);

	


	
	for (auto e : a)
		cout << "(" << e.first << ", " << e.second << ") ";

	return 0;
}