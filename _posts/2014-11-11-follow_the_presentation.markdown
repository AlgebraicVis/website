---
layout: post
title: "Algebraic Visualization Design: a primer"
date: 2014-11-11 12:46:00
---

Gordon will be presenting the
[paper](/posts/2014/11/10/vis-paper.html) tomorrow at the Design
Process and Persuasion session, at 2:20PM.

We'll be doing a series of posts about this work that will follow the
structure of the talk. This post is an adapted
version of the first act of the talk.

<script src="/assets/src/d3.v3.min.js"></script>
<script src="/assets/src/underscore-min.js"></script>
<script src="/assets/src/topojson.v1.min.js"></script>
<script src="/assets/src/jquery-2.1.1.min.js"></script>
<script src="/assets/src/posts/vis2014_presentation/main.js"></script>
<script src="/assets/src/posts/vis2014_presentation/election.js"></script>
<link rel="stylesheet" href="/css/frozenScroll.css"/>

# Let's get started

Carlos and I have written
a theory paper about
a mathematical approach
to understanding, critiquing, and improving
visualizations.

This isn't a typical vis theory paper,
so we didn't think it would be well served by a typical talk.
Rather than structure the talk directly around the paper,

### This talk

I'll give an alternate path into the ideas of the paper,
by focusing on some example visualizations,
and the questions we can ask about them.

I'll also talk at a high-level about the math in our "Algebraic design",
there are more details in the paper.
Some related work will be highlighted as it comes up.

### The basic idea

We want to rethink the structure of theories of visualization.
Instead of saying
"Dataset is X, so then vis should be Y",
and talking about taxonomies of data, tasks, and methods,
maybe we can say
"we can X the data; can we Y the picture?"

So it's less about nouns, and categorization,
and more about verbs, and transformations.

Our approach is actually entirely about
transformations, differences, and changes
both in the data,
  the interesting or important ways the data to be visualized
  could have been different,
and in the visualization,
  changes which are clearly visible when they
  connect to perceptual channels and to affordances.

A designer using our approach will constantly be asking:

### The basic question

**"Are the important data changes
well-matched with obvious visual changes?"**

We think this one question is an incisive tool for
exposing how a given visualization method does or does not
work for a given task, and it helps to explain why.

We developed three algebraic visualization design principles,
by considering different facets of this one question.

But let's start with an example.

### 2014 Election Results in Virginia

Let's say we have a visualization of election results. Here we are
showing the results of 2014's senate race in Virginia, as reported by
the [New York
Times](http://www.nytimes.com/interactive/2014/11/04/upshot/senate-maps.html). 

<div id="election_results_pad_begin" style="position: absolute">
</div>
<div id="election_results" style="position: absolute; height: 300px;"></div>

We are all used to saying that a visualization of election results
that uses only full-red and full-blue is not a very good
visualization.

Spefically, we tend to say that is not as good as a visualization which uses a
graded red-purple-blue colormap.

![](/assets/transition.png)

<div id="election_results_rb_to_rpb"></div>

In turn, we sometimes hear "what you should *really* do is use a
double-ended colorscale instead", which transitions from red to
blue through gray, instead of directly purple.

![](/assets/transition.png)

<div id="election_results_rpb_to_rgb"></div>

But we want to go a little deeper: we would like to be able to explain
*in what sense* these visualizations are better than one another. The
way we are going to tease apart these explanations is by thinking
about what would happen to the image if we were to change the data in
some way. If we transform the data, what's the corresponding change in
the picture? Let's take it from the beginning.

Consider the first colormap again.

![](/assets/transition.png)

<div id="election_results_rgb_to_rb"></div>

We all have some intuition for why this is not a great visualization,
right? What is going on is that this picture shows us nothing about
how close each precinct's results are. In the way of thinking we will
discuss in this talk, we need to find a change in the dataset that
works as a "witness" for this problem.

Let us look at a scatterplot of the precinct result as a proxy for the
dataset, and let us imagine that this was a much tighter election.

![](/assets/transition.png)

<div id="election_results_show_scatterplot"></div>

Now, what we will do is that for every precinct, we will push the
results 80% of the way to a tie, and look at happens to the image.

![](/assets/transition.png)

<div id="election_results_show_closer"></div>

Now, we know we happens here: the visualization is exactly the same!
If democrats or republicans won by 10%, 1% or 0.1%, that makes no
difference for the colormap. This is not great.
In our paper, we call any change on the
data that does not change the picture a **confuser** for the
visualization. This issue of visualizations failing to be injective
has been pointed out in the literature by [Ziemkiewicz and
Kosara](http://viscenter.uncc.edu/sites/viscenter.uncc.edu/files/CVC-UNCC-10-15.PDF). Here,
though, we can go a bit further, and characterize the nature of the
injectivity failure as changes in the data (in this case, making the
election closer).

But now that we have described the problem with the vis **entirely in
terms of the data**, we can take this description of the problem and
see what it does to other visualizations.

![](/assets/transition.png)

<div id="election_results_show_purple_wide"></div>

Specifically, we can just plug this exact change of data (making the
elections closer) into other visualizations, like the red-purple-blue
colormapping, and see what happens with the image.

![](/assets/transition.png)

<div id="election_results_show_purple_close"></div>

In the case of the red-purple-blue visualization, we see that all precincts in
the picture move towards a central color. So the confuser for the
red-blue map is **not** a confuser for the red-purple-blue map: that is
one specific sense in which the blue-purple-red map is better than the
blue-red map. New terminology: In this talk we will call the
 changes in the data  **"alpha"**s, and **"omega"**s will be the corresponding
 changes in the images.

We just showed one alpha that lets us compare the visualizations in
some specific way.

![](/assets/transition.png)

<div id="election_results_show_redblue_2"></div>

But we are not limited to a single alpha, and
as we will see, picking different alphas is a great way to explore
different aspects of a visualization. So let us now
transform the data differently, by **flipping** the outcomes. Every
vote for the republicans now count for the democrats and vice-versa.

![](/assets/transition.png)

<div id="election_results_show_redblue_inverted"></div>

The red-blue visualization does exactly what you expect: blue states
become red states, and vice-versa. That's good.

![](/assets/transition.png)

<div id="election_results_show_purple_wide_2"></div>

But now, let's look at what happens for this same transformation,
except using the red-purple-blue visualization. 

![](/assets/transition.png)

<div id="election_results_show_purple_inverted"></div>

For the precincts with
extreme outcomes, it's easy to see what happens: like the red-blue
colormap, reds become blues and vice-versa. But let's pay
attention to the tight results. In this case, we have a
slightly-reddish-purple turning into a slight-blueish-purple, and
vice-versa. That's not so great: whether or not a color will become
more reddish or less reddish under this omega depends on being to
either side of a particular shade of purple, a distinction which our
eyes are not very good at making.

More specifically, it's hard to see, without flipping the
data back and worth, which
shade of purple will **stay the same**. These are important because
when you think about the data
values, those that do not change under the "inversion" alpha are
precisely the tied
precincts. So what we are effectively doing is using this alpha to model ties, and
noticing that the omega is not great at picking out these ties.

Notice that talking about omegas is necessarily talking about the
human vision system.  So discussions of omega need to happen based on
our scientific knowledge and models of the human vision, which are
central issues in perceptual research in vis.

In the case of this red-purple-blue example, we say there was a
failure in that the visualization caused a **jumbler** for the notion of
a tie in a precinct.  This is a different kind of problem than a
confuser: the data change is reflected in the picture, but it is done
in a way that our visual system is bad at perceiving.

In contrast, consider a red-gray-blue election map.

![](/assets/transition.png)

<div id="election_results_show_rgb_2"></div>

In this visualization, the fixed point for the omega corresponding to
the inversion alpha is **gray**.

![](/assets/transition.png)

<div id="election_results_show_rgb_inverted"></div>

The inversion keeps the saturation of the
color the same, and a tied race corresponds to a completely
desaturated color. In this visualization, then, the inversion alpha
gets mapped to a categorical change in the hue, which happens to be a
no-op when there is no saturation. When these hues are opposing, this
omega uses a structure that our eyes are good at capturing.
We can also examine the red-gray-blue election map with the
first alpha, that of making elections closer.

![](/assets/transition.png)

<div id="election_results_show_rgb_inverted_closer"></div>

Analogously, the tranformation that makes the election closer gets
mapped to another structure our eyes are relatively good at capturing:
reduction in saturation. At the same time, the hues do not change:
blues stay blue, and reds stay red.
(Note, that in practice one has to worry
about [simultaneous contrast](http://en.wikipedia.org/wiki/Contrast_effect), and this present analysis we are showing you does
not account for that. Nothing stops us from performing an algebraic
analysis of simultaneous contrast issues, though!)

<div id="election_results_pad_end"></div>

So now you've seen the basics of our algebraic process. We identified
some interesting possible changes in the data, and then studied how
the visualization method maps those to changes in the final image and
based on that, we could concretely criticize which color scales work
better for what thing.

For a theory of visualization design, though, we want to formalize and
generalize the design strategy we just used. This is what the next post
will be about.
